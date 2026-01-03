import React, { useMemo } from 'react';
import { Eye } from 'lucide-react';
import { ComplianceIssue, Severity, SEVERITY_CONFIG } from '@/types';

interface HighlightedContentProps {
  content: string;
  issues: ComplianceIssue[];
  onIssueClick?: (issueId: string) => void;
}

interface TextSegment {
  text: string;
  isHighlighted: boolean;
  severity?: Severity;
  issueId?: string;
}

export function HighlightedContent({
  content,
  issues,
  onIssueClick,
}: HighlightedContentProps) {
  const segments = useMemo(() => {
    if (issues.length === 0) {
      return [{ text: content, isHighlighted: false }];
    }

    // Sort issues by position
    const sortedIssues = [...issues].sort(
      (a, b) => a.position.start - b.position.start
    );

    const result: TextSegment[] = [];
    let currentIndex = 0;

    sortedIssues.forEach((issue) => {
      // Add non-highlighted text before this issue
      if (issue.position.start > currentIndex) {
        result.push({
          text: content.slice(currentIndex, issue.position.start),
          isHighlighted: false,
        });
      }

      // Add highlighted text
      if (issue.position.start >= currentIndex) {
        result.push({
          text: content.slice(issue.position.start, issue.position.end),
          isHighlighted: true,
          severity: issue.severity,
          issueId: issue.id,
        });
        currentIndex = issue.position.end;
      }
    });

    // Add remaining text
    if (currentIndex < content.length) {
      result.push({
        text: content.slice(currentIndex),
        isHighlighted: false,
      });
    }

    return result;
  }, [content, issues]);

  const getHighlightClass = (severity?: Severity) => {
    if (!severity) return '';
    const baseClass = 'underline decoration-2 cursor-pointer hover:opacity-80';
    switch (severity) {
      case 'critical':
        return `${baseClass} bg-red-100 decoration-red-500`;
      case 'high':
        return `${baseClass} bg-orange-100 decoration-orange-500`;
      case 'medium':
        return `${baseClass} bg-yellow-100 decoration-yellow-500`;
      case 'low':
        return `${baseClass} bg-blue-100 decoration-blue-500`;
      case 'info':
        return `${baseClass} bg-gray-100 decoration-gray-500`;
      default:
        return baseClass;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Eye className="h-5 w-5 text-blue-600" />
          Content Preview
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Issues are highlighted in the content below
        </p>
      </div>

      <div className="p-4">
        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-4 pb-4 border-b border-gray-200">
          {(Object.entries(SEVERITY_CONFIG) as [Severity, typeof SEVERITY_CONFIG['critical']][]).map(
            ([severity, config]) => (
              <div key={severity} className="flex items-center gap-1 text-xs">
                <span
                  className={`w-3 h-3 rounded ${config.bgColor} border ${config.color.replace('text', 'border')}`}
                />
                <span className="text-gray-600">{config.label}</span>
              </div>
            )
          )}
        </div>

        {/* Content with highlights */}
        <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-800">
          {segments.map((segment, index) =>
            segment.isHighlighted ? (
              <span
                key={index}
                className={getHighlightClass(segment.severity)}
                onClick={() => segment.issueId && onIssueClick?.(segment.issueId)}
                title={`Click to see details (${segment.severity})`}
              >
                {segment.text}
              </span>
            ) : (
              <span key={index}>{segment.text}</span>
            )
          )}
        </div>
      </div>
    </div>
  );
}
