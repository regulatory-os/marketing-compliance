/**
 * Marketing Compliance Types - Based on AMF (Autorité des Marchés Financiers) regulations
 */

export type Language = 'fr' | 'en';

export interface ProductType {
  categorie: string;
  sous_categorie?: string;
  nom_commercial?: string;
  isin?: string;
  emetteur_ou_societe_gestion?: string;
}

export interface TexteApplicable {
  code: string;
  titre: string;
  approche?: string;
  raison?: string;
}

export interface Qualification {
  type_document: string;
  type_produit: ProductType;
  public_cible: string;
  canal_distribution?: string;
  territoire?: string;
  caracteristiques: Record<string, boolean | number | null>;
  conditions_actives: string[];
  textes_applicables: TexteApplicable[];
}

export interface ActionCorrective {
  type: 'AJOUTER' | 'MODIFIER' | 'SUPPRIMER';
  texte_integral?: string;
  emplacement?: string;
  format?: string;
}

export type FindingStatus = 'CONFORME' | 'NON_CONFORME' | 'AMELIORATION' | 'NON_APPLICABLE' | 'NON_VERIFIABLE';

export interface Finding {
  obligation_id: string;
  statut: FindingStatus;
  niveau_criticite: number;
  criticite: string;
  extrait_document?: string;
  commentaire: string;
  action_corrective?: ActionCorrective;
}

export interface VerbatimManquant {
  obligation_id: string;
  texte_integral: string;
  variables?: Record<string, string>;
  emplacement?: string;
  format?: string;
}

export type Verdict = 'CONFORME' | 'NON_CONFORME' | 'A_VERIFIER';

export interface Rapport {
  verdict: Verdict;
  nb_obligations_verifiees: number;
  nb_conformes: number;
  nb_non_conformes: number;
  nb_ameliorations: number;
  nb_non_applicables: number;
  score_conformite: number;
}

export interface AnalysisByTexte {
  document_source: string;
  titre: string;
  nb_total: number;
  nb_conformes: number;
  nb_non_conformes: number;
  nb_ameliorations: number;
  nb_non_applicables: number;
  findings: Finding[];
}

export interface AnalysisResult {
  qualification: Qualification;
  rapport: Rapport;
  analyses_par_texte: AnalysisByTexte[];
  mentions_verbatim_manquantes: VerbatimManquant[];
  synthese: string;
}

export interface RegulatoryText {
  code: string;
  name: string;
  descFr: string;
  descEn: string;
}

// View options for results display
export type GroupByOption = 'texte' | 'statut' | 'criticite';

export interface ViewOptions {
  groupBy: GroupByOption;
  showNonApplicable: boolean;
  sortBy: 'criticite_desc' | 'criticite_asc' | 'statut' | 'alphabetical';
}

// Enriched finding with source for flexible grouping
export interface EnrichedFinding extends Finding {
  texteSource: string;
  texteTitre: string;
}

// Finding group for flexible display
export interface FindingGroup {
  key: string;
  label: string;
  description?: string;
  findings: EnrichedFinding[];
  stats: {
    total: number;
    conformes: number;
    nonConformes: number;
    ameliorations: number;
    nonApplicables: number;
    nonVerifiables: number;
  };
}

// Workflow states for the 3-phase analysis process
export type WorkflowState = 'upload' | 'qualifying' | 'review' | 'analyzing' | 'results';

// Product categories
export const PRODUCT_CATEGORIES = [
  'OPCVM',
  'FIA',
  'SCPI',
  'OPCI',
  'GFI',
  'SOFICA',
  'FCPR',
  'FCPI',
  'FIP',
  'ETF',
  'titre_creance_complexe',
  'EMTN',
  'produit_structure',
  'autre',
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];

// Product sub-categories
export const PRODUCT_SUBCATEGORIES = [
  'actions',
  'obligations',
  'diversifie',
  'monetaire',
  'formule',
  'indiciel',
  'autre',
] as const;

export type ProductSubcategory = typeof PRODUCT_SUBCATEGORIES[number];

// Document types
export const DOCUMENT_TYPES = [
  'brochure',
  'page_web',
  'email',
  'reseaux_sociaux',
  'presentation',
  'fiche_produit',
  'autre',
] as const;

export type DocumentType = typeof DOCUMENT_TYPES[number];

// Target audiences
export const TARGET_AUDIENCES = [
  'non_professionnel',
  'professionnel',
] as const;

export type TargetAudience = typeof TARGET_AUDIENCES[number];

// Regulatory text codes
export const REGULATORY_TEXT_CODES = [
  'DOC-2011-24',
  'DOC-2010-05',
  'DOC-2017-06',
  'ESMA34-45-1272',
  'DOC-2020-03',
  'DOC-2017-01',
  'DOC-2013-12',
  'DOC-2014-03',
  'DOC-2024-06',
  'DOC-2017-07',
] as const;

export type RegulatoryTextCode = typeof REGULATORY_TEXT_CODES[number];

// Metadata for regulatory texts
export const REGULATORY_TEXT_METADATA: Record<RegulatoryTextCode, { title: string; descriptionFr: string; descriptionEn: string }> = {
  'DOC-2011-24': {
    title: 'Communications publicitaires OPC',
    descriptionFr: 'Placements collectifs et SOFICA',
    descriptionEn: 'Collective investments and SOFICA',
  },
  'DOC-2010-05': {
    title: 'Instruments complexes',
    descriptionFr: 'Produits structurés, EMTN, titres de créance',
    descriptionEn: 'Structured products, EMTN, debt securities',
  },
  'DOC-2017-06': {
    title: 'Biens divers',
    descriptionFr: 'Art, vin, forêts, diamants, IBD',
    descriptionEn: 'Art, wine, forests, diamonds',
  },
  'ESMA34-45-1272': {
    title: 'Guidelines MiFID II publicités',
    descriptionFr: 'Communications marketing instruments financiers',
    descriptionEn: 'Marketing communications for financial instruments',
  },
  'DOC-2020-03': {
    title: 'ESG / Finance durable',
    descriptionFr: 'Allégations extra-financières et durables',
    descriptionEn: 'ESG and sustainable finance claims',
  },
  'DOC-2017-01': {
    title: 'PRIIPS / KID',
    descriptionFr: "Documents d'informations clés produits packagés",
    descriptionEn: 'Key information documents for packaged products',
  },
  'DOC-2013-12': {
    title: 'Démarchage et conseils',
    descriptionFr: 'Règles de démarchage bancaire et financier',
    descriptionEn: 'Financial solicitation and advice rules',
  },
  'DOC-2014-03': {
    title: 'Crowdfunding',
    descriptionFr: 'Financement participatif et plateformes',
    descriptionEn: 'Crowdfunding platforms and regulations',
  },
  'DOC-2024-06': {
    title: 'Crypto-actifs / MiCA',
    descriptionFr: 'Communications sur actifs numériques',
    descriptionEn: 'Digital assets marketing communications',
  },
  'DOC-2017-07': {
    title: 'Influenceurs financiers',
    descriptionFr: 'Publicité par influenceurs et réseaux sociaux',
    descriptionEn: 'Financial influencer advertising',
  },
};

// Available active conditions for filtering obligations
export const AVAILABLE_CONDITIONS = [
  'TOUJOURS',
  'SI_OPCVM',
  'SI_FIA',
  'SI_SCPI',
  'SI_OPCI',
  'SI_GFI',
  'SI_SOFICA',
  'SI_ETF',
  'SI_FCPR_FCPI_FIP',
  'SI_FONDS_FORMULE',
  'SI_FONDS_INDICIEL',
  'SI_FONDS_MONETAIRE',
  'SI_PRODUIT_STRUCTURE',
  'SI_TITRE_CREANCE_COMPLEXE',
  'SI_CFD_FOREX',
  'SI_CRYPTO',
  'SI_BIENS_DIVERS',
  'SI_PUBLIC_NON_PROFESSIONNEL',
  'SI_PUBLIC_PROFESSIONNEL',
  'SI_PERFORMANCES_AFFICHEES',
  'SI_PERFORMANCES_PASSEES',
  'SI_PERFORMANCES_SIMULEES',
  'SI_FRAIS_AFFICHES',
  'SI_GARANTIE_CAPITAL',
  'SI_GARANTIE_RENDEMENT',
  'SI_RISQUE_PERTE_CAPITAL',
  'SI_RISQUE_PERTE_SUPERIEURE',
  'SI_ESG',
  'SI_LABEL_ISR',
  'SI_AVANTAGE_FISCAL',
  'SI_LIQUIDITE_LIMITEE',
  'SI_EFFET_LEVIER',
  'SI_CLASSEMENT_RANKING',
  'SI_SUPPORT_VIDEO',
  'SI_SUPPORT_WEB',
  'SI_SUPPORT_EMAIL',
  'SI_SUPPORT_RESEAUX_SOCIAUX',
  'SI_VIGILANCE_RENFORCEE',
] as const;

export type ActiveCondition = typeof AVAILABLE_CONDITIONS[number];
