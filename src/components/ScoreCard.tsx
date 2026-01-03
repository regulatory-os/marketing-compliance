import React from 'react';
import { Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { AnalysisSummary } from '@/types';

interface ScoreCardProps {
  score: number;
  summary: AnalysisSummary;
}

export function ScoreCard({ score, summary }: ScoreCardProps) {
  const getScoreColor = () => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreLabel = () => {
    if (score >= 80) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 40) return 'Poor';
    return 'Critical';
  };

  const getScoreBg = () => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    if (score >= 40) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className={`rounded-lg border-2 p-6 ${getScoreBg()}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${score >= 60 ? 'bg-green-100' : 'bg-red-100'}`}>
            <Shield className={`h-8 w-8 ${getScoreColor()}`} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">Compliance Score</h3>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-bold ${getScoreColor()}`}>{score}</span>
              <span className="text-gray-500">/100</span>
              <span className={`text-sm font-medium ${getScoreColor()}`}>
                ({getScoreLabel()})
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          {summary.criticalCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-lg font-bold text-red-700">{summary.criticalCount}</div>
                <div className="text-xs text-red-600">Critical</div>
              </div>
            </div>
          )}

          {summary.highCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-orange-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-lg font-bold text-orange-700">{summary.highCount}</div>
                <div className="text-xs text-orange-600">High</div>
              </div>
            </div>
          )}

          {summary.mediumCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-yellow-100 rounded-lg">
              <Info className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-lg font-bold text-yellow-700">{summary.mediumCount}</div>
                <div className="text-xs text-yellow-600">Medium</div>
              </div>
            </div>
          )}

          {summary.totalIssues === 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-sm font-bold text-green-700">No Issues</div>
                <div className="text-xs text-green-600">Great job!</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
