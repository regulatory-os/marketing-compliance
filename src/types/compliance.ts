/**
 * Compliance analysis types and interfaces
 */

export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type ComplianceCategory =
  | 'misleading_claims'
  | 'unsubstantiated_claims'
  | 'pricing_issues'
  | 'disclaimer_missing'
  | 'prohibited_terms'
  | 'comparative_advertising'
  | 'testimonial_issues'
  | 'urgency_manipulation'
  | 'hidden_conditions'
  | 'data_privacy'
  | 'environmental_claims'
  | 'health_claims'
  | 'financial_claims'
  | 'target_audience';

export interface ComplianceIssue {
  id: string;
  category: ComplianceCategory;
  severity: Severity;
  title: string;
  description: string;
  matchedText: string;
  position: {
    start: number;
    end: number;
  };
  suggestion?: string;
  regulation?: string;
}

export interface ComplianceRule {
  id: string;
  category: ComplianceCategory;
  name: string;
  description: string;
  severity: Severity;
  patterns: RegExp[];
  suggestion: string;
  regulation?: string;
}

export interface AnalysisResult {
  id: string;
  content: string;
  timestamp: Date;
  issues: ComplianceIssue[];
  score: number;
  summary: AnalysisSummary;
}

export interface AnalysisSummary {
  totalIssues: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  infoCount: number;
  categoryCounts: Record<ComplianceCategory, number>;
}

export interface ContentType {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface AnalysisOptions {
  contentType: string;
  strictMode: boolean;
  includeInfoLevel: boolean;
  targetMarket?: string;
}

export const CONTENT_TYPES: ContentType[] = [
  {
    id: 'email',
    name: 'Email Marketing',
    description: 'Promotional emails, newsletters, drip campaigns',
  },
  {
    id: 'social',
    name: 'Social Media',
    description: 'Posts, ads, and content for social platforms',
  },
  {
    id: 'website',
    name: 'Website Copy',
    description: 'Landing pages, product descriptions, CTAs',
  },
  {
    id: 'advertising',
    name: 'Advertising',
    description: 'Display ads, video scripts, print materials',
  },
  {
    id: 'press',
    name: 'Press Release',
    description: 'Company announcements, news releases',
  },
];

export const SEVERITY_CONFIG: Record<Severity, { label: string; color: string; bgColor: string }> = {
  critical: { label: 'Critical', color: 'text-red-700', bgColor: 'bg-red-100' },
  high: { label: 'High', color: 'text-orange-700', bgColor: 'bg-orange-100' },
  medium: { label: 'Medium', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  low: { label: 'Low', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  info: { label: 'Info', color: 'text-gray-700', bgColor: 'bg-gray-100' },
};

export const CATEGORY_LABELS: Record<ComplianceCategory, string> = {
  misleading_claims: 'Misleading Claims',
  unsubstantiated_claims: 'Unsubstantiated Claims',
  pricing_issues: 'Pricing Issues',
  disclaimer_missing: 'Missing Disclaimers',
  prohibited_terms: 'Prohibited Terms',
  comparative_advertising: 'Comparative Advertising',
  testimonial_issues: 'Testimonial Issues',
  urgency_manipulation: 'Urgency Manipulation',
  hidden_conditions: 'Hidden Conditions',
  data_privacy: 'Data Privacy',
  environmental_claims: 'Environmental Claims',
  health_claims: 'Health Claims',
  financial_claims: 'Financial Claims',
  target_audience: 'Target Audience',
};
