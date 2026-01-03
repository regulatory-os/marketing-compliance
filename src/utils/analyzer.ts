import {
  AnalysisResult,
  AnalysisSummary,
  ComplianceIssue,
  ComplianceCategory,
  AnalysisOptions,
  Severity,
} from '@/types';
import { COMPLIANCE_RULES } from './complianceRules';

/**
 * Generate a unique ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculate compliance score based on issues found
 * Score ranges from 0 (worst) to 100 (best)
 */
function calculateScore(issues: ComplianceIssue[]): number {
  if (issues.length === 0) return 100;

  const severityWeights: Record<Severity, number> = {
    critical: 25,
    high: 15,
    medium: 8,
    low: 3,
    info: 1,
  };

  const totalDeduction = issues.reduce((sum, issue) => {
    return sum + severityWeights[issue.severity];
  }, 0);

  return Math.max(0, 100 - totalDeduction);
}

/**
 * Generate analysis summary from issues
 */
function generateSummary(issues: ComplianceIssue[]): AnalysisSummary {
  const categoryCounts = {} as Record<ComplianceCategory, number>;

  // Initialize all categories to 0
  const categories: ComplianceCategory[] = [
    'misleading_claims',
    'unsubstantiated_claims',
    'pricing_issues',
    'disclaimer_missing',
    'prohibited_terms',
    'comparative_advertising',
    'testimonial_issues',
    'urgency_manipulation',
    'hidden_conditions',
    'data_privacy',
    'environmental_claims',
    'health_claims',
    'financial_claims',
    'target_audience',
  ];

  categories.forEach((cat) => {
    categoryCounts[cat] = 0;
  });

  let criticalCount = 0;
  let highCount = 0;
  let mediumCount = 0;
  let lowCount = 0;
  let infoCount = 0;

  issues.forEach((issue) => {
    categoryCounts[issue.category]++;

    switch (issue.severity) {
      case 'critical':
        criticalCount++;
        break;
      case 'high':
        highCount++;
        break;
      case 'medium':
        mediumCount++;
        break;
      case 'low':
        lowCount++;
        break;
      case 'info':
        infoCount++;
        break;
    }
  });

  return {
    totalIssues: issues.length,
    criticalCount,
    highCount,
    mediumCount,
    lowCount,
    infoCount,
    categoryCounts,
  };
}

/**
 * Main analysis function - analyzes marketing content for compliance issues
 */
export function analyzeContent(
  content: string,
  options: AnalysisOptions = {
    contentType: 'general',
    strictMode: false,
    includeInfoLevel: true,
  }
): AnalysisResult {
  const issues: ComplianceIssue[] = [];
  const seenMatches = new Set<string>();

  // Filter rules based on options
  let rulesToApply = [...COMPLIANCE_RULES];

  if (!options.includeInfoLevel) {
    rulesToApply = rulesToApply.filter((rule) => rule.severity !== 'info');
  }

  // Apply each rule
  rulesToApply.forEach((rule) => {
    rule.patterns.forEach((pattern) => {
      // Reset pattern if it has global flag
      pattern.lastIndex = 0;

      let match;
      while ((match = pattern.exec(content)) !== null) {
        const matchedText = match[0];
        const position = {
          start: match.index,
          end: match.index + matchedText.length,
        };

        // Create a unique key to avoid duplicate issues
        const matchKey = `${rule.id}-${position.start}-${position.end}`;

        if (!seenMatches.has(matchKey)) {
          seenMatches.add(matchKey);

          issues.push({
            id: generateId(),
            category: rule.category,
            severity: rule.severity,
            title: rule.name,
            description: rule.description,
            matchedText,
            position,
            suggestion: rule.suggestion,
            regulation: rule.regulation,
          });
        }

        // Prevent infinite loops for patterns that match empty strings
        if (match.index === pattern.lastIndex) {
          pattern.lastIndex++;
        }
      }
    });
  });

  // Sort issues by position
  issues.sort((a, b) => a.position.start - b.position.start);

  const score = calculateScore(issues);
  const summary = generateSummary(issues);

  return {
    id: generateId(),
    content,
    timestamp: new Date(),
    issues,
    score,
    summary,
  };
}

/**
 * Get highlighted content with issue markers
 */
export function getHighlightedRanges(
  issues: ComplianceIssue[]
): Array<{ start: number; end: number; severity: Severity; issueId: string }> {
  return issues.map((issue) => ({
    start: issue.position.start,
    end: issue.position.end,
    severity: issue.severity,
    issueId: issue.id,
  }));
}

/**
 * Filter issues by severity
 */
export function filterIssuesBySeverity(
  issues: ComplianceIssue[],
  severities: Severity[]
): ComplianceIssue[] {
  return issues.filter((issue) => severities.includes(issue.severity));
}

/**
 * Filter issues by category
 */
export function filterIssuesByCategory(
  issues: ComplianceIssue[],
  categories: ComplianceCategory[]
): ComplianceIssue[] {
  return issues.filter((issue) => categories.includes(issue.category));
}

/**
 * Generate compliance report text
 */
export function generateReport(result: AnalysisResult): string {
  const lines: string[] = [];

  lines.push('# Marketing Compliance Analysis Report');
  lines.push('');
  lines.push(`**Date:** ${result.timestamp.toLocaleString()}`);
  lines.push(`**Compliance Score:** ${result.score}/100`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Total Issues: ${result.summary.totalIssues}`);
  lines.push(`- Critical: ${result.summary.criticalCount}`);
  lines.push(`- High: ${result.summary.highCount}`);
  lines.push(`- Medium: ${result.summary.mediumCount}`);
  lines.push(`- Low: ${result.summary.lowCount}`);
  lines.push(`- Info: ${result.summary.infoCount}`);
  lines.push('');

  if (result.issues.length > 0) {
    lines.push('## Issues Found');
    lines.push('');

    result.issues.forEach((issue, index) => {
      lines.push(`### ${index + 1}. ${issue.title}`);
      lines.push('');
      lines.push(`**Severity:** ${issue.severity.toUpperCase()}`);
      lines.push(`**Category:** ${issue.category.replace(/_/g, ' ')}`);
      lines.push('');
      lines.push(`**Matched Text:** "${issue.matchedText}"`);
      lines.push('');
      lines.push(`**Description:** ${issue.description}`);
      lines.push('');
      if (issue.suggestion) {
        lines.push(`**Suggestion:** ${issue.suggestion}`);
        lines.push('');
      }
      if (issue.regulation) {
        lines.push(`**Regulation:** ${issue.regulation}`);
        lines.push('');
      }
      lines.push('---');
      lines.push('');
    });
  } else {
    lines.push('## No Issues Found');
    lines.push('');
    lines.push('Your content appears to be compliant with marketing regulations.');
  }

  lines.push('');
  lines.push('*This report is generated for informational purposes only and does not constitute legal advice.*');

  return lines.join('\n');
}
