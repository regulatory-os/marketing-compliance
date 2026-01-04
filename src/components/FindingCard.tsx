import { useState } from 'react';
import type { EnrichedFinding, Language } from '@/types';
import { STATUS_CONFIG, t } from '@/utils/constants';

interface FindingCardProps {
  finding: EnrichedFinding;
  language: Language;
}

export function FindingCard({ finding, language }: FindingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = STATUS_CONFIG[finding.statut];

  const criticalityColors: Record<string, string> = {
    Critique: 'bg-red-100 text-red-800',
    Majeur: 'bg-orange-100 text-orange-800',
    Mineur: 'bg-yellow-100 text-yellow-800',
    Info: 'bg-gray-100 text-gray-600',
  };

  return (
    <div
      className={`border rounded-lg overflow-hidden ${config.borderColor} ${config.bgColor}`}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-opacity-80 transition-colors"
      >
        <div className="flex items-center gap-3">
          {/* Status indicator */}
          <div
            className={`w-2 h-2 rounded-full ${
              finding.statut === 'CONFORME'
                ? 'bg-green-500'
                : finding.statut === 'NON_CONFORME'
                ? 'bg-red-500'
                : finding.statut === 'AMELIORATION'
                ? 'bg-blue-500'
                : 'bg-gray-400'
            }`}
          />

          {/* Obligation ID */}
          <span className="font-mono text-sm font-medium text-gray-700">
            {finding.obligation_id}
          </span>

          {/* Criticality badge */}
          {finding.criticite && (
            <span
              className={`px-2 py-0.5 text-xs rounded-full ${
                criticalityColors[finding.criticite] || criticalityColors.Info
              }`}
            >
              {finding.criticite}
            </span>
          )}
        </div>

        {/* Status label */}
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${config.textColor}`}>
            {language === 'fr' ? config.labelFr : config.labelEn}
          </span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-100">
          {/* Comment */}
          {finding.commentaire && (
            <div className="pt-3">
              <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">
                {t('comment', language)}
              </h4>
              <p className="text-sm text-gray-700">{finding.commentaire}</p>
            </div>
          )}

          {/* Document excerpt */}
          {finding.extrait_document && (
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">
                {t('documentExcerpt', language)}
              </h4>
              <blockquote className="text-sm text-gray-600 italic bg-white bg-opacity-50 px-3 py-2 rounded border-l-2 border-gray-300">
                &ldquo;{finding.extrait_document}&rdquo;
              </blockquote>
            </div>
          )}

          {/* Corrective action */}
          {finding.action_corrective && (
            <div className="bg-white bg-opacity-50 rounded-lg p-3">
              <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">
                {t('correctiveAction', language)}
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 text-xs rounded font-medium ${
                      finding.action_corrective.type === 'AJOUTER'
                        ? 'bg-green-100 text-green-700'
                        : finding.action_corrective.type === 'MODIFIER'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {finding.action_corrective.type}
                  </span>
                </div>
                {finding.action_corrective.texte_integral && (
                  <p className="text-sm text-gray-700 font-medium">
                    {finding.action_corrective.texte_integral}
                  </p>
                )}
                {finding.action_corrective.emplacement && (
                  <p className="text-xs text-gray-500">
                    {language === 'fr' ? 'Emplacement' : 'Location'}:{' '}
                    {finding.action_corrective.emplacement}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Source text reference */}
          <div className="text-xs text-gray-400 pt-2">
            {finding.texteSource} - {finding.texteTitre}
          </div>
        </div>
      )}
    </div>
  );
}
