/**
 * Mock analyzer for standalone version
 * Simulates AI analysis without requiring API calls
 */

import type {
  AnalysisResult,
  Qualification,
  Finding,
  AnalysisByTexte,
  VerbatimManquant,
  FindingStatus,
} from '@/types';

// Sample obligations that would be checked
const SAMPLE_OBLIGATIONS = {
  'DOC-2011-24': [
    { id: 'DOC-2011-24-1', desc: 'Mention du caractère promotionnel', criticite: 'Majeur' },
    { id: 'DOC-2011-24-2', desc: 'Équilibre entre avantages et risques', criticite: 'Critique' },
    { id: 'DOC-2011-24-3', desc: 'Avertissement sur le risque de perte en capital', criticite: 'Critique' },
    { id: 'DOC-2011-24-4', desc: 'Mention des frais', criticite: 'Majeur' },
    { id: 'DOC-2011-24-5', desc: 'Référence au DIC/DICI', criticite: 'Majeur' },
    { id: 'DOC-2011-24-6', desc: 'Performances passées avec disclaimer', criticite: 'Majeur' },
    { id: 'DOC-2011-24-7', desc: 'Identification de la société de gestion', criticite: 'Mineur' },
  ],
  'DOC-2010-05': [
    { id: 'DOC-2010-05-1', desc: 'Mention du risque de perte totale', criticite: 'Critique' },
    { id: 'DOC-2010-05-2', desc: 'Explication du mécanisme du produit', criticite: 'Majeur' },
    { id: 'DOC-2010-05-3', desc: 'Scénarios de performance', criticite: 'Majeur' },
    { id: 'DOC-2010-05-4', desc: 'Mention de la complexité du produit', criticite: 'Majeur' },
  ],
  'ESMA34-45-1272': [
    { id: 'ESMA-1', desc: 'Information claire et non trompeuse', criticite: 'Critique' },
    { id: 'ESMA-2', desc: 'Identification comme communication marketing', criticite: 'Majeur' },
    { id: 'ESMA-3', desc: 'Cohérence avec documentation réglementaire', criticite: 'Majeur' },
  ],
};

// Keywords to detect in content for mock analysis
const POSITIVE_KEYWORDS = [
  'risque', 'perte', 'capital', 'frais', 'commission', 'avertissement',
  'attention', 'DIC', 'DICI', 'prospectus', 'disclaimer', 'performance passée',
  'société de gestion', 'agrément', 'AMF', 'promotionnel', 'publicitaire',
];

const NEGATIVE_KEYWORDS = [
  'garanti', 'sans risque', 'rendement assuré', 'opportunité unique',
  'meilleur', 'exceptionnel', 'inratable', 'fortune', 'enrichissement',
];

/**
 * Simulate document qualification based on content analysis
 */
export function simulateQualification(content: string): Qualification {
  const lowerContent = content.toLowerCase();

  // Detect product type
  let categorie = 'OPCVM';
  if (lowerContent.includes('scpi')) categorie = 'SCPI';
  else if (lowerContent.includes('opcvm')) categorie = 'OPCVM';
  else if (lowerContent.includes('fia')) categorie = 'FIA';
  else if (lowerContent.includes('etf')) categorie = 'ETF';
  else if (lowerContent.includes('structuré') || lowerContent.includes('structure')) categorie = 'produit_structure';
  else if (lowerContent.includes('emtn')) categorie = 'EMTN';

  // Detect document type
  let type_document = 'brochure';
  if (lowerContent.includes('email') || lowerContent.includes('newsletter')) type_document = 'email';
  else if (lowerContent.includes('site') || lowerContent.includes('page web')) type_document = 'page_web';
  else if (lowerContent.includes('réseaux sociaux') || lowerContent.includes('linkedin')) type_document = 'reseaux_sociaux';

  // Detect target audience
  const public_cible = lowerContent.includes('professionnel') && !lowerContent.includes('non professionnel')
    ? 'professionnel'
    : 'non_professionnel';

  // Detect characteristics
  const caracteristiques: Record<string, boolean> = {
    performances_affichees: /\d+\s*%/.test(content) || lowerContent.includes('performance'),
    frais_affiches: lowerContent.includes('frais') || lowerContent.includes('commission'),
    risque_perte_capital: lowerContent.includes('perte') || lowerContent.includes('risque'),
    esg: lowerContent.includes('esg') || lowerContent.includes('durable') || lowerContent.includes('responsable'),
  };

  // Determine applicable texts based on product type
  const textes_applicables = [];

  if (['OPCVM', 'FIA', 'SCPI', 'OPCI', 'ETF'].includes(categorie)) {
    textes_applicables.push({
      code: 'DOC-2011-24',
      titre: 'Communications publicitaires OPC',
      raison: 'Produit de placement collectif',
    });
  }

  if (['produit_structure', 'EMTN', 'titre_creance_complexe'].includes(categorie)) {
    textes_applicables.push({
      code: 'DOC-2010-05',
      titre: 'Instruments complexes',
      raison: 'Produit structuré ou titre de créance',
    });
  }

  textes_applicables.push({
    code: 'ESMA34-45-1272',
    titre: 'Guidelines MiFID II',
    raison: 'Applicable à toute communication marketing',
  });

  if (caracteristiques.esg) {
    textes_applicables.push({
      code: 'DOC-2020-03',
      titre: 'ESG / Finance durable',
      raison: 'Allégations ESG détectées',
    });
  }

  // Build conditions
  const conditions_actives = ['TOUJOURS'];
  if (categorie === 'OPCVM') conditions_actives.push('SI_OPCVM');
  if (categorie === 'SCPI') conditions_actives.push('SI_SCPI');
  if (public_cible === 'non_professionnel') conditions_actives.push('SI_PUBLIC_NON_PROFESSIONNEL');
  if (caracteristiques.performances_affichees) conditions_actives.push('SI_PERFORMANCES_AFFICHEES');
  if (caracteristiques.frais_affiches) conditions_actives.push('SI_FRAIS_AFFICHES');
  if (caracteristiques.risque_perte_capital) conditions_actives.push('SI_RISQUE_PERTE_CAPITAL');

  return {
    type_document,
    type_produit: {
      categorie,
      nom_commercial: extractProductName(content),
    },
    public_cible,
    caracteristiques,
    conditions_actives,
    textes_applicables,
  };
}

function extractProductName(content: string): string | undefined {
  // Try to extract a product name (simplified)
  const patterns = [
    /(?:fonds|OPCVM|FIA|SCPI)\s+["«]?([A-Z][A-Za-zÀ-ÿ\s]+)["»]?/,
    /["«]([A-Z][A-Za-zÀ-ÿ\s]+)["»]\s+(?:est|propose|offre)/,
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) return match[1].trim();
  }
  return undefined;
}

/**
 * Simulate compliance analysis
 */
export function simulateAnalysis(content: string, qualification: Qualification): AnalysisResult {
  const lowerContent = content.toLowerCase();
  const analyses_par_texte: AnalysisByTexte[] = [];
  const mentions_verbatim_manquantes: VerbatimManquant[] = [];

  let totalConformes = 0;
  let totalNonConformes = 0;
  let totalAmeliorations = 0;
  let totalNonApplicables = 0;

  // Analyze each applicable text
  for (const texte of qualification.textes_applicables) {
    const obligations = SAMPLE_OBLIGATIONS[texte.code as keyof typeof SAMPLE_OBLIGATIONS] || [];
    const findings: Finding[] = [];

    for (const obligation of obligations) {
      const finding = analyzeObligation(obligation, lowerContent, content, qualification);
      findings.push(finding);

      switch (finding.statut) {
        case 'CONFORME': totalConformes++; break;
        case 'NON_CONFORME': totalNonConformes++; break;
        case 'AMELIORATION': totalAmeliorations++; break;
        case 'NON_APPLICABLE': totalNonApplicables++; break;
      }

      // Add missing verbatim for non-compliant critical items
      if (finding.statut === 'NON_CONFORME' && finding.niveau_criticite >= 3) {
        mentions_verbatim_manquantes.push({
          obligation_id: finding.obligation_id,
          texte_integral: generateMissingMention(obligation.id),
          emplacement: 'En-tête ou pied de document',
          format: 'Lisible et visible',
        });
      }
    }

    analyses_par_texte.push({
      document_source: texte.code,
      titre: texte.titre,
      nb_total: findings.length,
      nb_conformes: findings.filter(f => f.statut === 'CONFORME').length,
      nb_non_conformes: findings.filter(f => f.statut === 'NON_CONFORME').length,
      nb_ameliorations: findings.filter(f => f.statut === 'AMELIORATION').length,
      nb_non_applicables: findings.filter(f => f.statut === 'NON_APPLICABLE').length,
      findings,
    });
  }

  const total = totalConformes + totalNonConformes + totalAmeliorations;
  const score = total > 0 ? Math.round((totalConformes / total) * 100) : 0;

  const verdict = score >= 80 ? 'CONFORME' : score >= 50 ? 'A_VERIFIER' : 'NON_CONFORME';

  return {
    qualification,
    rapport: {
      verdict,
      nb_obligations_verifiees: total + totalNonApplicables,
      nb_conformes: totalConformes,
      nb_non_conformes: totalNonConformes,
      nb_ameliorations: totalAmeliorations,
      nb_non_applicables: totalNonApplicables,
      score_conformite: score,
    },
    analyses_par_texte,
    mentions_verbatim_manquantes,
    synthese: generateSynthesis(score, totalNonConformes, totalAmeliorations, qualification),
  };
}

function analyzeObligation(
  obligation: { id: string; desc: string; criticite: string },
  lowerContent: string,
  content: string,
  _qualification: Qualification
): Finding {
  let statut: FindingStatus = 'CONFORME';
  let commentaire = '';
  let extrait_document: string | undefined;

  // Check for positive indicators
  const hasPositiveKeywords = POSITIVE_KEYWORDS.some(kw => lowerContent.includes(kw));
  const hasNegativeKeywords = NEGATIVE_KEYWORDS.some(kw => lowerContent.includes(kw));

  // Simple heuristic based on obligation type
  if (obligation.id.includes('risque') || obligation.desc.toLowerCase().includes('risque')) {
    if (!lowerContent.includes('risque') && !lowerContent.includes('perte')) {
      statut = 'NON_CONFORME';
      commentaire = "Aucune mention du risque n'a été identifiée dans le document.";
    } else {
      statut = 'CONFORME';
      commentaire = 'Le risque est mentionné dans le document.';
      const match = content.match(/.{0,50}risque.{0,50}/i);
      if (match) extrait_document = match[0];
    }
  } else if (obligation.desc.toLowerCase().includes('promotionnel')) {
    if (!lowerContent.includes('promotionnel') && !lowerContent.includes('publicitaire') && !lowerContent.includes('publicité')) {
      statut = 'NON_CONFORME';
      commentaire = "Le caractère promotionnel du document n'est pas mentionné.";
    } else {
      statut = 'CONFORME';
      commentaire = 'Le caractère promotionnel est indiqué.';
    }
  } else if (obligation.desc.toLowerCase().includes('frais')) {
    if (!lowerContent.includes('frais') && !lowerContent.includes('commission') && !lowerContent.includes('coût')) {
      statut = 'AMELIORATION';
      commentaire = 'Les frais ne sont pas explicitement mentionnés.';
    } else {
      statut = 'CONFORME';
      commentaire = 'Les frais sont mentionnés.';
    }
  } else if (hasNegativeKeywords) {
    statut = 'NON_CONFORME';
    const found = NEGATIVE_KEYWORDS.find(kw => lowerContent.includes(kw));
    commentaire = `Terme potentiellement trompeur détecté: "${found}"`;
    const match = content.match(new RegExp(`.{0,30}${found}.{0,30}`, 'i'));
    if (match) extrait_document = match[0];
  } else if (hasPositiveKeywords) {
    statut = 'CONFORME';
    commentaire = 'Les éléments requis semblent présents.';
  } else {
    // Random distribution for demo
    const rand = Math.random();
    if (rand < 0.6) {
      statut = 'CONFORME';
      commentaire = 'Obligation respectée.';
    } else if (rand < 0.8) {
      statut = 'AMELIORATION';
      commentaire = "Une amélioration pourrait être apportée pour plus de clarté.";
    } else {
      statut = 'NON_APPLICABLE';
      commentaire = 'Non applicable dans ce contexte.';
    }
  }

  const niveau_criticite = obligation.criticite === 'Critique' ? 4 :
    obligation.criticite === 'Majeur' ? 3 : 2;

  return {
    obligation_id: obligation.id,
    statut,
    niveau_criticite,
    criticite: obligation.criticite,
    commentaire,
    extrait_document,
    action_corrective: statut === 'NON_CONFORME' ? {
      type: 'AJOUTER',
      texte_integral: generateMissingMention(obligation.id),
      emplacement: 'À définir selon le format du document',
    } : undefined,
  };
}

function generateMissingMention(obligationId: string): string {
  const mentions: Record<string, string> = {
    'DOC-2011-24-1': 'Document à caractère promotionnel',
    'DOC-2011-24-2': 'Les performances passées ne préjugent pas des performances futures.',
    'DOC-2011-24-3': 'Risque de perte en capital. Le capital investi n\'est pas garanti.',
    'DOC-2011-24-5': 'Avant tout investissement, veuillez consulter le Document d\'Information Clé (DIC).',
    'DOC-2010-05-1': 'Ce produit présente un risque de perte totale du capital investi.',
    'ESMA-2': 'Communication à caractère promotionnel',
  };

  return mentions[obligationId] || 'Mention réglementaire requise';
}

function generateSynthesis(
  score: number,
  nonConformes: number,
  ameliorations: number,
  qualification: Qualification
): string {
  let synthesis = '';

  if (score >= 80) {
    synthesis = `Ce document marketing pour ${qualification.type_produit.categorie} présente un bon niveau de conformité (${score}%). `;
  } else if (score >= 50) {
    synthesis = `Ce document marketing nécessite des ajustements. Score de conformité: ${score}%. `;
  } else {
    synthesis = `ATTENTION: Ce document présente des non-conformités significatives (score: ${score}%). Une révision approfondie est recommandée. `;
  }

  if (nonConformes > 0) {
    synthesis += `${nonConformes} non-conformité(s) identifiée(s) nécessitant une correction. `;
  }

  if (ameliorations > 0) {
    synthesis += `${ameliorations} amélioration(s) suggérée(s) pour optimiser la conformité.`;
  }

  return synthesis.trim();
}

export { SAMPLE_OBLIGATIONS };
