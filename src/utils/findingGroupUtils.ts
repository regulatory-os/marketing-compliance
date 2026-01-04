import type { Language, EnrichedFinding, FindingGroup, ViewOptions, AnalysisByTexte, Finding } from '@/types';

/**
 * Calculate stats for a group of findings
 */
export function calculateFindingStats(findings: EnrichedFinding[]) {
  return {
    total: findings.length,
    conformes: findings.filter(f => f.statut === 'CONFORME').length,
    nonConformes: findings.filter(f => f.statut === 'NON_CONFORME').length,
    ameliorations: findings.filter(f => f.statut === 'AMELIORATION').length,
    nonApplicables: findings.filter(f => f.statut === 'NON_APPLICABLE').length,
    nonVerifiables: findings.filter(f => f.statut === 'NON_VERIFIABLE').length,
  };
}

/**
 * Enrich findings with their source text information
 */
export function enrichFindings(analysesByTexte: AnalysisByTexte[]): EnrichedFinding[] {
  return analysesByTexte.flatMap(texte =>
    texte.findings.map((f: Finding) => ({
      ...f,
      texteSource: texte.document_source,
      texteTitre: texte.titre,
    }))
  );
}

/**
 * Group findings by regulatory text
 */
export function groupFindingsByTexte(findings: EnrichedFinding[]): FindingGroup[] {
  const groups = new Map<string, EnrichedFinding[]>();

  for (const finding of findings) {
    const key = finding.texteSource;
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(finding);
  }

  return Array.from(groups.entries()).map(([key, groupFindings]) => ({
    key,
    label: key,
    description: groupFindings[0]?.texteTitre,
    findings: groupFindings,
    stats: calculateFindingStats(groupFindings),
  }));
}

/**
 * Group findings by status
 */
export function groupFindingsByStatut(findings: EnrichedFinding[], language: Language): FindingGroup[] {
  const statusOrder = ['NON_CONFORME', 'AMELIORATION', 'CONFORME', 'NON_APPLICABLE', 'NON_VERIFIABLE'];
  const statusLabels: Record<string, { fr: string; en: string }> = {
    CONFORME: { fr: 'Conforme', en: 'Compliant' },
    NON_CONFORME: { fr: 'Non conforme', en: 'Non-compliant' },
    AMELIORATION: { fr: 'Amélioration suggérée', en: 'Suggested improvement' },
    NON_APPLICABLE: { fr: 'Non applicable', en: 'Not applicable' },
    NON_VERIFIABLE: { fr: 'Non vérifiable', en: 'Not verifiable' },
  };

  const groups = new Map<string, EnrichedFinding[]>();

  for (const finding of findings) {
    const key = finding.statut;
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(finding);
  }

  return statusOrder
    .filter(status => groups.has(status))
    .map(status => ({
      key: status,
      label: statusLabels[status]?.[language] || status,
      findings: groups.get(status)!,
      stats: calculateFindingStats(groups.get(status)!),
    }));
}

/**
 * Group findings by criticality
 */
export function groupFindingsByCriticite(findings: EnrichedFinding[], language: Language): FindingGroup[] {
  const criticalityLabels: Record<string, { fr: string; en: string }> = {
    'Critique': { fr: 'Critique', en: 'Critical' },
    'Majeur': { fr: 'Majeur', en: 'Major' },
    'Mineur': { fr: 'Mineur', en: 'Minor' },
    'Info': { fr: 'Information', en: 'Information' },
  };

  const groups = new Map<string, EnrichedFinding[]>();

  for (const finding of findings) {
    const key = finding.criticite || 'Info';
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(finding);
  }

  const criticalityOrder = ['Critique', 'Majeur', 'Mineur', 'Info'];

  return criticalityOrder
    .filter(crit => groups.has(crit))
    .map(crit => ({
      key: crit,
      label: criticalityLabels[crit]?.[language] || crit,
      findings: groups.get(crit)!,
      stats: calculateFindingStats(groups.get(crit)!),
    }));
}

/**
 * Sort findings based on the selected sort option
 */
export function sortFindings(findings: EnrichedFinding[], sortBy: ViewOptions['sortBy']): EnrichedFinding[] {
  const sorted = [...findings];
  sorted.sort((a, b) => {
    switch (sortBy) {
      case 'criticite_desc':
        return (b.niveau_criticite || 0) - (a.niveau_criticite || 0);
      case 'criticite_asc':
        return (a.niveau_criticite || 0) - (b.niveau_criticite || 0);
      case 'statut':
        return a.statut.localeCompare(b.statut);
      case 'alphabetical':
      default:
        return a.obligation_id.localeCompare(b.obligation_id);
    }
  });
  return sorted;
}

/**
 * Get grouped findings based on view options
 */
export function getGroupedFindings(
  analysesByTexte: AnalysisByTexte[],
  viewOptions: ViewOptions,
  language: Language
): FindingGroup[] {
  let allFindings = enrichFindings(analysesByTexte);

  if (!viewOptions.showNonApplicable) {
    allFindings = allFindings.filter(f => f.statut !== 'NON_APPLICABLE');
  }

  allFindings = sortFindings(allFindings, viewOptions.sortBy);

  switch (viewOptions.groupBy) {
    case 'statut':
      return groupFindingsByStatut(allFindings, language);
    case 'criticite':
      return groupFindingsByCriticite(allFindings, language);
    case 'texte':
    default:
      return groupFindingsByTexte(allFindings);
  }
}

/**
 * Count non-applicable findings in all analyses
 */
export function countNonApplicableFindings(analysesByTexte: AnalysisByTexte[]): number {
  return analysesByTexte.reduce((sum, texte) => sum + texte.nb_non_applicables, 0);
}
