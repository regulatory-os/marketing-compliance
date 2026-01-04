import type { Rapport, Language } from '@/types';
import { getVerdictConfig, getScoreColor, t } from '@/utils/constants';

interface ScoreCardProps {
  rapport: Rapport;
  language: Language;
}

export function ScoreCard({ rapport, language }: ScoreCardProps) {
  const verdictConfig = getVerdictConfig(rapport.verdict, language);
  const scoreColor = getScoreColor(rapport.score_conformite);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          {t('complianceScore', language)}
        </h2>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${verdictConfig.bgColor} ${verdictConfig.color}`}
        >
          {verdictConfig.label}
        </span>
      </div>

      {/* Score circle */}
      <div className="flex justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              className="stroke-gray-200"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              className={scoreColor.replace('text-', 'stroke-')}
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${(rapport.score_conformite / 100) * 352} 352`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-3xl font-bold ${scoreColor}`}>
              {rapport.score_conformite}%
            </span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm text-gray-600">{t('compliant', language)}</span>
          </div>
          <span className="text-2xl font-bold text-green-700">{rapport.nb_conformes}</span>
        </div>

        <div className="bg-red-50 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-sm text-gray-600">{t('nonCompliant', language)}</span>
          </div>
          <span className="text-2xl font-bold text-red-700">{rapport.nb_non_conformes}</span>
        </div>

        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm text-gray-600">{t('improvement', language)}</span>
          </div>
          <span className="text-2xl font-bold text-blue-700">{rapport.nb_ameliorations}</span>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-400" />
            <span className="text-sm text-gray-600">
              {language === 'fr' ? 'Non applicable' : 'Not applicable'}
            </span>
          </div>
          <span className="text-2xl font-bold text-gray-600">{rapport.nb_non_applicables}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t text-center">
        <span className="text-sm text-gray-500">
          {rapport.nb_obligations_verifiees} {language === 'fr' ? 'obligations vérifiées' : 'obligations checked'}
        </span>
      </div>
    </div>
  );
}
