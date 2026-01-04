import React, { useState } from 'react';
import type { Language } from '@/types';
import { useMarketingAnalysis } from '@/hooks';
import {
  ContentInput,
  QualificationReview,
  AnalysisResults,
  LanguageToggle,
} from '@/components';
import { t } from '@/utils/constants';

function App() {
  const [language, setLanguage] = useState<Language>('fr');

  const {
    content,
    setContent,
    workflowState,
    setWorkflowState,
    qualification,
    setQualification,
    result,
    error,
    isLoading,
    qualify,
    analyze,
    reset,
  } = useMarketingAnalysis();

  // Sample marketing content for testing
  const loadSampleContent = (type: 'opcvm' | 'structured' | 'noncompliant') => {
    const samples = {
      opcvm: `Document promotionnel - OPCVM "Avenir Dynamique"

Ce fonds OPCVM géré par Exemple Asset Management, société de gestion agréée par l'AMF, vous propose une stratégie d'investissement diversifiée axée sur les marchés actions européens.

Performances passées :
- 2023 : +8,5%
- 2022 : -3,2%
- 2021 : +12,1%

Les performances passées ne préjugent pas des performances futures.

Frais : Frais de gestion annuels de 1,5% TTC. Frais d'entrée : 2% maximum.

AVERTISSEMENT : Ce fonds présente un risque de perte en capital. Avant tout investissement, veuillez consulter le Document d'Information Clé (DIC) disponible sur notre site ou auprès de votre conseiller.

Ce document à caractère promotionnel ne constitue pas un conseil en investissement.`,

      structured: `Offre exclusive - Produit structuré EMTN "Rendement Plus 2026"

Investissez dans notre nouveau produit structuré indexé sur l'indice Euro Stoxx 50.

Caractéristiques :
- Durée : 5 ans
- Protection du capital à 90% à l'échéance
- Coupon conditionnel de 6% par an

Ce produit est un instrument complexe qui peut être difficile à comprendre. Il est réservé aux investisseurs avertis.

Risque de perte en capital : L'investisseur peut perdre une partie ou la totalité de son capital investi.

Pour plus d'informations, consultez le prospectus et le DIC disponibles sur demande.`,

      noncompliant: `INVESTISSEMENT GARANTI - Rendement exceptionnel !

Fonds "Super Gains" - L'opportunité unique à ne pas manquer !

Rendement garanti de 15% par an - Sans aucun risque !

C'est le meilleur placement du marché, tous nos clients sont satisfaits et deviennent riches rapidement.

Dépêchez-vous, offre limitée aux 100 premiers investisseurs !

Contactez-nous maintenant pour profiter de cette opportunité inratable.`,
    };

    setContent(samples[type]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {language === 'fr'
                    ? 'Analyse Conformité Marketing'
                    : 'Marketing Compliance Analyzer'}
                </h1>
                <p className="text-xs text-gray-500">
                  {language === 'fr'
                    ? 'Réglementation AMF - Version standalone'
                    : 'AMF Regulations - Standalone version'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <LanguageToggle language={language} onChange={setLanguage} />

              <a
                href="https://github.com/regulatory-os/marketing-compliance"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="hidden sm:inline">GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Progress indicator */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2">
            {['upload', 'review', 'results'].map((step, idx) => {
              const stepLabels = {
                upload: language === 'fr' ? '1. Document' : '1. Document',
                review: language === 'fr' ? '2. Qualification' : '2. Qualification',
                results: language === 'fr' ? '3. Résultats' : '3. Results',
              };
              const isActive =
                (step === 'upload' && workflowState === 'upload') ||
                (step === 'review' && (workflowState === 'qualifying' || workflowState === 'review')) ||
                (step === 'results' && (workflowState === 'analyzing' || workflowState === 'results'));
              const isCompleted =
                (step === 'upload' && workflowState !== 'upload') ||
                (step === 'review' && (workflowState === 'analyzing' || workflowState === 'results'));

              return (
                <React.Fragment key={step}>
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : isCompleted
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {isCompleted ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : null}
                    {stepLabels[step as keyof typeof stepLabels]}
                  </div>
                  {idx < 2 && (
                    <div className={`flex-1 h-0.5 ${isCompleted ? 'bg-green-300' : 'bg-gray-200'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Upload phase */}
        {workflowState === 'upload' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <ContentInput
                  content={content}
                  onContentChange={setContent}
                  onSubmit={qualify}
                  isLoading={isLoading}
                  language={language}
                />
              </div>
            </div>

            <div className="space-y-6">
              {/* Sample content */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h3 className="font-medium text-gray-900 mb-3">
                  {language === 'fr' ? 'Exemples de test' : 'Sample content'}
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => loadSampleContent('opcvm')}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded border border-gray-200"
                  >
                    {language === 'fr' ? 'OPCVM conforme' : 'Compliant UCITS'}
                  </button>
                  <button
                    onClick={() => loadSampleContent('structured')}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded border border-gray-200"
                  >
                    {language === 'fr' ? 'Produit structuré' : 'Structured product'}
                  </button>
                  <button
                    onClick={() => loadSampleContent('noncompliant')}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded border border-gray-200"
                  >
                    {language === 'fr' ? 'Document non conforme' : 'Non-compliant document'}
                  </button>
                </div>
              </div>

              {/* Privacy notice */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-green-600 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <div>
                    <h4 className="font-medium text-green-800">
                      {t('privacyTitle', language)}
                    </h4>
                    <p className="text-sm text-green-700 mt-1">
                      {t('privacyText', language)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Qualifying/Review phase */}
        {(workflowState === 'qualifying' || workflowState === 'review') && qualification && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <QualificationReview
                qualification={qualification}
                onUpdate={setQualification}
                onConfirm={analyze}
                onBack={() => setWorkflowState('upload')}
                isLoading={isLoading}
                language={language}
              />
            </div>
          </div>
        )}

        {/* Analyzing phase */}
        {workflowState === 'analyzing' && (
          <div className="max-w-md mx-auto text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">{t('analyzing', language)}</p>
          </div>
        )}

        {/* Results phase */}
        {workflowState === 'results' && result && (
          <AnalysisResults result={result} language={language} onReset={reset} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>
              {language === 'fr'
                ? "Analyse de conformité marketing - Un outil open-source par "
                : 'Marketing Compliance Analyzer - An open-source tool by '}
              <a
                href="https://github.com/regulatory-os"
                className="text-blue-600 hover:underline"
              >
                regulatory-os
              </a>
            </p>
            <p className="mt-2">{t('aiDisclaimer', language)}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
