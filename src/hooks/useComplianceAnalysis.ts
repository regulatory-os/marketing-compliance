import { useState, useCallback, useMemo } from 'react';
import {
  AnalysisResult,
  AnalysisOptions,
  ComplianceIssue,
  Severity,
  ComplianceCategory,
} from '@/types';
import {
  analyzeContent,
  filterIssuesBySeverity,
  filterIssuesByCategory,
  generateReport,
} from '@/utils';

interface UseComplianceAnalysisReturn {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
  error: string | null;
  analyze: (content: string, options?: Partial<AnalysisOptions>) => void;
  clearResult: () => void;
  filteredIssues: ComplianceIssue[];
  severityFilter: Severity[];
  setSeverityFilter: (severities: Severity[]) => void;
  categoryFilter: ComplianceCategory[];
  setCategoryFilter: (categories: ComplianceCategory[]) => void;
  exportReport: () => string;
  history: AnalysisResult[];
  clearHistory: () => void;
}

const DEFAULT_OPTIONS: AnalysisOptions = {
  contentType: 'general',
  strictMode: false,
  includeInfoLevel: true,
};

export function useComplianceAnalysis(): UseComplianceAnalysisReturn {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);

  const [severityFilter, setSeverityFilter] = useState<Severity[]>([
    'critical',
    'high',
    'medium',
    'low',
    'info',
  ]);
  const [categoryFilter, setCategoryFilter] = useState<ComplianceCategory[]>([]);

  const analyze = useCallback(
    (content: string, options?: Partial<AnalysisOptions>) => {
      setIsAnalyzing(true);
      setError(null);

      // Simulate async behavior for UX
      setTimeout(() => {
        try {
          if (!content.trim()) {
            setError('Please enter some content to analyze');
            setIsAnalyzing(false);
            return;
          }

          const mergedOptions: AnalysisOptions = {
            ...DEFAULT_OPTIONS,
            ...options,
          };

          const analysisResult = analyzeContent(content, mergedOptions);
          setResult(analysisResult);
          setHistory((prev) => [analysisResult, ...prev].slice(0, 10)); // Keep last 10
        } catch (err) {
          setError(
            err instanceof Error ? err.message : 'An error occurred during analysis'
          );
        } finally {
          setIsAnalyzing(false);
        }
      }, 500); // Simulated delay for better UX
    },
    []
  );

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const filteredIssues = useMemo(() => {
    if (!result) return [];

    let issues = result.issues;

    if (severityFilter.length > 0 && severityFilter.length < 5) {
      issues = filterIssuesBySeverity(issues, severityFilter);
    }

    if (categoryFilter.length > 0) {
      issues = filterIssuesByCategory(issues, categoryFilter);
    }

    return issues;
  }, [result, severityFilter, categoryFilter]);

  const exportReport = useCallback(() => {
    if (!result) return '';
    return generateReport(result);
  }, [result]);

  return {
    result,
    isAnalyzing,
    error,
    analyze,
    clearResult,
    filteredIssues,
    severityFilter,
    setSeverityFilter,
    categoryFilter,
    setCategoryFilter,
    exportReport,
    history,
    clearHistory,
  };
}
