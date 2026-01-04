import { useState, useMemo } from 'react';
import type { AnalysisResult, Language, ViewOptions, GroupByOption } from '@/types';
import { t, countNonApplicableFindings, getGroupedFindings } from '@/utils';
import { ScoreCard } from './ScoreCard';
import { FindingCard } from './FindingCard';

interface AnalysisResultsProps {
  result: AnalysisResult;
  language: Language;
  onReset: () => void;
}

export function AnalysisResults({ result, language, onReset }: AnalysisResultsProps) {
  const [viewOptions, setViewOptions] = useState<ViewOptions>({
    groupBy: 'texte',
    showNonApplicable: false,
    sortBy: 'criticite_desc',
  });

  const groupedFindings = useMemo(() => {
    return getGroupedFindings(result.analyses_par_texte, viewOptions, language);
  }, [result.analyses_par_texte, viewOptions, language]);

  const nonApplicableCount = useMemo(() => {
    return countNonApplicableFindings(result.analyses_par_texte);
  }, [result.analyses_par_texte]);

  const handleGroupByChange = (groupBy: GroupByOption) => {
    setViewOptions({ ...viewOptions, groupBy });
  };

  const groupByOptions: { value: GroupByOption; labelKey: keyof typeof import('@/utils/constants').translations.fr }[] = [
    { value: 'texte', labelKey: 'groupByTexte' },
    { value: 'statut', labelKey: 'groupByStatut' },
    { value: 'criticite', labelKey: 'groupByCriticite' },
  ];

  const sortOptions: { value: ViewOptions['sortBy']; labelKey: keyof typeof import('@/utils/constants').translations.fr }[] = [
    { value: 'criticite_desc', labelKey: 'sortByCriticiteDesc' },
    { value: 'criticite_asc', labelKey: 'sortByCriticiteAsc' },
    { value: 'statut', labelKey: 'sortByStatut' },
    { value: 'alphabetical', labelKey: 'sortByAlphabetical' },
  ];

  return (
    <div className="space-y-6">
      {/* Header with reset button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          {language === 'fr' ? 'Résultats de l\'analyse' : 'Analysis Results'}
        </h2>
        <button
          onClick={onReset}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {language === 'fr' ? 'Nouvelle analyse' : 'New analysis'}
        </button>
      </div>

      {/* Synthesis */}
      {result.synthese && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-800 mb-2">
            {language === 'fr' ? 'Synthèse' : 'Summary'}
          </h3>
          <p className="text-sm text-blue-700">{result.synthese}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Score Card */}
        <div className="lg:col-span-1">
          <ScoreCard rapport={result.rapport} language={language} />

          {/* Missing verbatim mentions */}
          {result.mentions_verbatim_manquantes.length > 0 && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-medium text-red-800 mb-3">
                {t('missingMentions', language)}
              </h3>
              <div className="space-y-2">
                {result.mentions_verbatim_manquantes.map((mention, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-red-100 rounded p-2"
                  >
                    <p className="text-sm font-medium text-gray-800">
                      {mention.texte_integral}
                    </p>
                    {mention.emplacement && (
                      <p className="text-xs text-gray-500 mt-1">
                        {mention.emplacement}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Findings list */}
        <div className="lg:col-span-2 space-y-4">
          {/* View controls */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              {/* Group by */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {language === 'fr' ? 'Grouper par:' : 'Group by:'}
                </span>
                <div className="flex gap-1">
                  {groupByOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleGroupByChange(opt.value)}
                      className={`px-3 py-1 text-sm rounded transition-colors ${
                        viewOptions.groupBy === opt.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {t(opt.labelKey, language)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort by */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {language === 'fr' ? 'Trier:' : 'Sort:'}
                </span>
                <select
                  value={viewOptions.sortBy}
                  onChange={(e) =>
                    setViewOptions({
                      ...viewOptions,
                      sortBy: e.target.value as ViewOptions['sortBy'],
                    })
                  }
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {t(opt.labelKey, language)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Show non-applicable toggle */}
              {nonApplicableCount > 0 && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={viewOptions.showNonApplicable}
                    onChange={(e) =>
                      setViewOptions({
                        ...viewOptions,
                        showNonApplicable: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-600">
                    {language === 'fr'
                      ? `Afficher non applicables (${nonApplicableCount})`
                      : `Show not applicable (${nonApplicableCount})`}
                  </span>
                </label>
              )}
            </div>
          </div>

          {/* Grouped findings */}
          {groupedFindings.map((group) => (
            <div key={group.key} className="space-y-2">
              {/* Group header */}
              <div className="flex items-center justify-between px-2">
                <div>
                  <h3 className="font-medium text-gray-900">{group.label}</h3>
                  {group.description && (
                    <p className="text-sm text-gray-500">{group.description}</p>
                  )}
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded">
                    {group.stats.conformes}
                  </span>
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded">
                    {group.stats.nonConformes}
                  </span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                    {group.stats.ameliorations}
                  </span>
                </div>
              </div>

              {/* Findings */}
              <div className="space-y-2">
                {group.findings.map((finding, idx) => (
                  <FindingCard
                    key={`${finding.obligation_id}-${idx}`}
                    finding={finding}
                    language={language}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Disclaimer */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
        <p className="text-sm text-gray-500">{t('aiDisclaimer', language)}</p>
      </div>
    </div>
  );
}
