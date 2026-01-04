import type { Language, RegulatoryText } from '@/types';

// File limits
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
export const MIN_CONTENT_CHARS = 100;
export const MAX_CONTENT_CHARS = 150_000;
export const ACCEPTED_FILE_TYPES = ['.pdf', '.doc', '.docx', '.txt'];

// Regulatory texts covered by the analysis
export const REGULATORY_TEXTS: RegulatoryText[] = [
  {
    code: 'DOC-2011-24',
    name: 'Communications publicitaires OPC',
    descFr: 'Placements collectifs et SOFICA',
    descEn: 'Collective investments and SOFICA',
  },
  {
    code: 'DOC-2010-05',
    name: 'Instruments complexes',
    descFr: 'Produits structurés, EMTN, titres de créance',
    descEn: 'Structured products, EMTN, debt securities',
  },
  {
    code: 'DOC-2019-06',
    name: 'ESG / Extra-financier',
    descFr: 'Allégations durables et responsables',
    descEn: 'Sustainable and responsible claims',
  },
  {
    code: 'DOC-2017-06',
    name: 'Biens divers',
    descFr: 'Art, vin, forêts, diamants, IBD',
    descEn: 'Art, wine, forests, diamonds',
  },
];

// Status configuration for findings
export const STATUS_CONFIG = {
  CONFORME: {
    labelFr: 'Conforme',
    labelEn: 'Compliant',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
    iconColor: 'text-green-600',
  },
  NON_CONFORME: {
    labelFr: 'Non conforme',
    labelEn: 'Non-compliant',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-700',
    iconColor: 'text-red-600',
  },
  AMELIORATION: {
    labelFr: 'Amélioration',
    labelEn: 'Improvement',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    iconColor: 'text-blue-600',
  },
  NON_APPLICABLE: {
    labelFr: 'Non applicable',
    labelEn: 'Not applicable',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    textColor: 'text-gray-500',
    iconColor: 'text-gray-400',
  },
  NON_VERIFIABLE: {
    labelFr: 'Non vérifiable',
    labelEn: 'Not verifiable',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-700',
    iconColor: 'text-yellow-600',
  },
};

// Get verdict display configuration
export function getVerdictConfig(verdict: string, language: Language) {
  switch (verdict) {
    case 'CONFORME':
      return {
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        label: language === 'fr' ? 'Conforme' : 'Compliant',
      };
    case 'NON_CONFORME':
      return {
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        label: language === 'fr' ? 'Non conforme' : 'Non-compliant',
      };
    default:
      return {
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        label: language === 'fr' ? 'À vérifier' : 'To verify',
      };
  }
}

// Get score color based on value
export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
}

// Translations
export const translations = {
  fr: {
    dropDocument: 'Déposez votre document marketing',
    clickToSelect: 'ou cliquez pour sélectionner',
    acceptedFormats: 'Formats acceptés : PDF, DOC, DOCX, TXT • Max 10 Mo',
    selectedFiles: 'Fichiers sélectionnés',
    extractedText: 'Texte extrait',
    documentContent: 'Contenu du document',
    pasteText: 'Collez le texte de votre document marketing ici...',
    startAnalysis: "Lancer l'analyse",
    analyzing: 'Analyse en cours...',
    extracting: 'Extraction du texte...',
    characters: 'caractères',
    complianceScore: 'Score de conformité',
    compliant: 'Conforme',
    nonCompliant: 'Non conforme',
    improvement: 'Amélioration',
    documentQualification: 'Qualification du document',
    documentType: 'Type de document',
    productCategory: 'Catégorie produit',
    commercialName: 'Nom commercial',
    targetAudience: 'Public cible',
    applicableTexts: 'Textes applicables',
    missingMentions: 'Mentions obligatoires manquantes',
    analysisByText: 'Analyse par texte réglementaire',
    comment: 'Commentaire',
    documentExcerpt: 'Extrait du document',
    correctiveAction: 'Action corrective',
    downloadPdf: 'Télécharger PDF',
    exportExcel: 'Exporter Excel',
    groupByTexte: 'Grouper par texte',
    groupByStatut: 'Grouper par statut',
    groupByCriticite: 'Grouper par criticité',
    sortByCriticiteDesc: 'Criticité (décroissante)',
    sortByCriticiteAsc: 'Criticité (croissante)',
    sortByStatut: 'Trier par statut',
    sortByAlphabetical: 'Alphabétique',
    notApplicableNote: "Cette obligation n'est pas applicable pour ce type de document.",
    privacyTitle: 'Confidentialité garantie',
    privacyText: 'Version standalone - Analyse locale simulée. Aucune donnée envoyée.',
    analysisSuccess: 'Analyse terminée avec succès',
    analysisError: "Une erreur est survenue lors de l'analyse.",
    textTooShort: 'Le contenu est trop court (minimum 100 caractères)',
    aiDisclaimer: "Cet outil utilise l'intelligence artificielle à des fins d'aide à la décision uniquement. Il ne constitue pas un conseil juridique.",
  },
  en: {
    dropDocument: 'Drop your marketing document',
    clickToSelect: 'or click to select',
    acceptedFormats: 'Accepted formats: PDF, DOC, DOCX, TXT • Max 10 MB',
    selectedFiles: 'Selected files',
    extractedText: 'Extracted text',
    documentContent: 'Document content',
    pasteText: 'Paste your marketing document text here...',
    startAnalysis: 'Start Analysis',
    analyzing: 'Analyzing...',
    extracting: 'Extracting text...',
    characters: 'characters',
    complianceScore: 'Compliance Score',
    compliant: 'Compliant',
    nonCompliant: 'Non-compliant',
    improvement: 'Improvement',
    documentQualification: 'Document qualification',
    documentType: 'Document type',
    productCategory: 'Product category',
    commercialName: 'Commercial name',
    targetAudience: 'Target audience',
    applicableTexts: 'Applicable texts',
    missingMentions: 'Missing mandatory mentions',
    analysisByText: 'Analysis by regulatory text',
    comment: 'Comment',
    documentExcerpt: 'Document excerpt',
    correctiveAction: 'Corrective action',
    downloadPdf: 'Download PDF',
    exportExcel: 'Export Excel',
    groupByTexte: 'Group by text',
    groupByStatut: 'Group by status',
    groupByCriticite: 'Group by criticality',
    sortByCriticiteDesc: 'Criticality (descending)',
    sortByCriticiteAsc: 'Criticality (ascending)',
    sortByStatut: 'Sort by status',
    sortByAlphabetical: 'Alphabetical',
    notApplicableNote: 'This obligation is not applicable for this document type.',
    privacyTitle: 'Privacy guaranteed',
    privacyText: 'Standalone version - Simulated local analysis. No data sent.',
    analysisSuccess: 'Analysis completed successfully',
    analysisError: 'An error occurred during analysis.',
    textTooShort: 'Content is too short (minimum 100 characters)',
    aiDisclaimer: 'This tool uses AI for decision support only. It does not constitute legal advice.',
  },
};

export function t(key: keyof typeof translations.fr, language: Language): string {
  return translations[language][key] || key;
}
