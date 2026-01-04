import React from 'react';
import type { Qualification, Language, ProductCategory, DocumentType, TargetAudience } from '@/types';
import { PRODUCT_CATEGORIES, DOCUMENT_TYPES, TARGET_AUDIENCES } from '@/types';
import { t } from '@/utils/constants';

interface QualificationReviewProps {
  qualification: Qualification;
  onUpdate: (qualification: Qualification) => void;
  onConfirm: () => void;
  onBack: () => void;
  isLoading: boolean;
  language: Language;
}

export function QualificationReview({
  qualification,
  onUpdate,
  onConfirm,
  onBack,
  isLoading,
  language,
}: QualificationReviewProps) {
  const handleCategoryChange = (categorie: ProductCategory) => {
    onUpdate({
      ...qualification,
      type_produit: { ...qualification.type_produit, categorie },
    });
  };

  const handleDocumentTypeChange = (type_document: DocumentType) => {
    onUpdate({ ...qualification, type_document });
  };

  const handleTargetChange = (public_cible: TargetAudience) => {
    onUpdate({ ...qualification, public_cible });
  };

  const handleCharacteristicToggle = (key: string) => {
    onUpdate({
      ...qualification,
      caracteristiques: {
        ...qualification.caracteristiques,
        [key]: !qualification.caracteristiques[key],
      },
    });
  };

  const categoryLabels: Record<string, { fr: string; en: string }> = {
    OPCVM: { fr: 'OPCVM', en: 'UCITS' },
    FIA: { fr: 'FIA', en: 'AIF' },
    SCPI: { fr: 'SCPI', en: 'SCPI' },
    OPCI: { fr: 'OPCI', en: 'OPCI' },
    GFI: { fr: 'GFI', en: 'GFI' },
    SOFICA: { fr: 'SOFICA', en: 'SOFICA' },
    FCPR: { fr: 'FCPR', en: 'FCPR' },
    FCPI: { fr: 'FCPI', en: 'FCPI' },
    FIP: { fr: 'FIP', en: 'FIP' },
    ETF: { fr: 'ETF', en: 'ETF' },
    titre_creance_complexe: { fr: 'Titre de créance complexe', en: 'Complex debt security' },
    EMTN: { fr: 'EMTN', en: 'EMTN' },
    produit_structure: { fr: 'Produit structuré', en: 'Structured product' },
    autre: { fr: 'Autre', en: 'Other' },
  };

  const documentTypeLabels: Record<string, { fr: string; en: string }> = {
    brochure: { fr: 'Brochure', en: 'Brochure' },
    page_web: { fr: 'Page web', en: 'Web page' },
    email: { fr: 'Email / Newsletter', en: 'Email / Newsletter' },
    reseaux_sociaux: { fr: 'Réseaux sociaux', en: 'Social media' },
    presentation: { fr: 'Présentation', en: 'Presentation' },
    fiche_produit: { fr: 'Fiche produit', en: 'Product sheet' },
    autre: { fr: 'Autre', en: 'Other' },
  };

  const targetLabels: Record<string, { fr: string; en: string }> = {
    non_professionnel: { fr: 'Non professionnel (grand public)', en: 'Non-professional (retail)' },
    professionnel: { fr: 'Professionnel', en: 'Professional' },
  };

  const characteristicLabels: Record<string, { fr: string; en: string }> = {
    performances_affichees: { fr: 'Performances affichées', en: 'Performance displayed' },
    frais_affiches: { fr: 'Frais affichés', en: 'Fees displayed' },
    risque_perte_capital: { fr: 'Risque de perte en capital mentionné', en: 'Capital loss risk mentioned' },
    esg: { fr: 'Allégations ESG / durables', en: 'ESG / sustainable claims' },
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 mb-2">
          {language === 'fr' ? 'Vérification de la qualification' : 'Qualification review'}
        </h3>
        <p className="text-sm text-blue-600">
          {language === 'fr'
            ? "Vérifiez et ajustez si nécessaire la qualification automatique de votre document avant l'analyse."
            : 'Review and adjust if needed the automatic qualification of your document before analysis.'}
        </p>
      </div>

      {/* Product category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('productCategory', language)}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {PRODUCT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                qualification.type_produit.categorie === cat
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
              }`}
            >
              {categoryLabels[cat]?.[language] || cat}
            </button>
          ))}
        </div>
      </div>

      {/* Document type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('documentType', language)}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {DOCUMENT_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => handleDocumentTypeChange(type)}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                qualification.type_document === type
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
              }`}
            >
              {documentTypeLabels[type]?.[language] || type}
            </button>
          ))}
        </div>
      </div>

      {/* Target audience */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('targetAudience', language)}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {TARGET_AUDIENCES.map((target) => (
            <button
              key={target}
              onClick={() => handleTargetChange(target)}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                qualification.public_cible === target
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
              }`}
            >
              {targetLabels[target]?.[language] || target}
            </button>
          ))}
        </div>
      </div>

      {/* Characteristics */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'fr' ? 'Caractéristiques détectées' : 'Detected characteristics'}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(characteristicLabels).map(([key, labels]) => (
            <label
              key={key}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={!!qualification.caracteristiques[key]}
                onChange={() => handleCharacteristicToggle(key)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm">{labels[language]}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Applicable texts */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('applicableTexts', language)}
        </label>
        <div className="space-y-2">
          {qualification.textes_applicables.map((texte) => (
            <div
              key={texte.code}
              className="flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg"
            >
              <div>
                <span className="font-mono text-sm font-medium text-gray-700">
                  {texte.code}
                </span>
                <span className="ml-2 text-sm text-gray-500">{texte.titre}</span>
              </div>
              {texte.raison && (
                <span className="text-xs text-gray-400">{texte.raison}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-4 border-t">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          {language === 'fr' ? 'Retour' : 'Back'}
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            isLoading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isLoading
            ? (language === 'fr' ? 'Analyse en cours...' : 'Analyzing...')
            : (language === 'fr' ? "Lancer l'analyse" : 'Start analysis')}
        </button>
      </div>
    </div>
  );
}
