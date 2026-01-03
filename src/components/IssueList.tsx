import React, { useState } from 'react';
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  BookOpen,
  Filter,
} from 'lucide-react';
import { ComplianceIssue, Severity, SEVERITY_CONFIG, CATEGORY_LABELS } from '@/types';

interface IssueListProps {
  issues: ComplianceIssue[];
  severityFilter: Severity[];
  onSeverityFilterChange: (severities: Severity[]) => void;
}

export function IssueList({
  issues,
  severityFilter,
  onSeverityFilterChange,
}: IssueListProps) {
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const toggleSeverity = (severity: Severity) => {
    if (severityFilter.includes(severity)) {
      onSeverityFilterChange(severityFilter.filter((s) => s !== severity));
    } else {
      onSeverityFilterChange([...severityFilter, severity]);
    }
  };

  const getSeverityIcon = (severity: Severity) => {
    const config = SEVERITY_CONFIG[severity];
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  if (issues.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-gray-400 mb-2">
          <AlertTriangle className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">No issues found</h3>
        <p className="text-gray-500 mt-1">
          Your content appears to be compliant with common marketing regulations.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Issues Found ({issues.length})
          </h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            {(Object.keys(SEVERITY_CONFIG) as Severity[]).map((severity) => (
              <button
                key={severity}
                onClick={() => toggleSeverity(severity)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  severityFilter.includes(severity)
                    ? `${SEVERITY_CONFIG[severity].bgColor} ${SEVERITY_CONFIG[severity].color} border-current`
                    : 'bg-gray-100 text-gray-500 border-gray-300'
                }`}
              >
                {SEVERITY_CONFIG[severity].label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="divide-y divide-gray-200">
        {issues.map((issue) => (
          <div key={issue.id} className="p-4">
            <div
              className="flex items-start justify-between cursor-pointer"
              onClick={() =>
                setExpandedIssue(expandedIssue === issue.id ? null : issue.id)
              }
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {getSeverityIcon(issue.severity)}
                  <span className="text-xs text-gray-500">
                    {CATEGORY_LABELS[issue.category]}
                  </span>
                </div>
                <h3 className="font-medium text-gray-900">{issue.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
                <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                  <code className="text-sm text-red-600">"{issue.matchedText}"</code>
                </div>
              </div>
              <button className="ml-4 text-gray-400 hover:text-gray-600">
                {expandedIssue === issue.id ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
            </div>

            {expandedIssue === issue.id && (
              <div className="mt-4 space-y-3">
                {issue.suggestion && (
                  <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                    <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Suggestion</h4>
                      <p className="text-sm text-blue-700">{issue.suggestion}</p>
                    </div>
                  </div>
                )}

                {issue.regulation && (
                  <div className="flex items-start gap-2 p-3 bg-purple-50 rounded-lg">
                    <BookOpen className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-purple-900">Regulation</h4>
                      <p className="text-sm text-purple-700">{issue.regulation}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
