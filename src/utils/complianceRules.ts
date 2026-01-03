import { ComplianceRule } from '@/types';

/**
 * Comprehensive compliance rules for marketing content analysis
 * Based on FTC, GDPR, CAN-SPAM, and general advertising standards
 */
export const COMPLIANCE_RULES: ComplianceRule[] = [
  // Misleading Claims
  {
    id: 'misleading-guarantee',
    category: 'misleading_claims',
    name: 'Absolute Guarantee',
    description: 'Claims of absolute guarantees without conditions may be misleading',
    severity: 'high',
    patterns: [
      /\b(100%|100 percent)\s*(guarantee|guaranteed|satisfaction|money.?back|effective|success|safe)\b/gi,
      /\bguarantee[ds]?\s*(results?|success|satisfaction|cure|work)\b/gi,
      /\balways\s+works?\b/gi,
    ],
    suggestion: 'Add specific conditions or limitations to guarantee claims. Consider using "satisfaction guarantee with conditions" instead.',
    regulation: 'FTC Act Section 5',
  },
  {
    id: 'misleading-best',
    category: 'misleading_claims',
    name: 'Unqualified Superlatives',
    description: 'Using "best", "number one", or "#1" without substantiation',
    severity: 'medium',
    patterns: [
      /\b(the\s+)?best\s+(in\s+class|in\s+the\s+world|on\s+the\s+market|available|choice|option|solution)\b/gi,
      /\b#1\s*(rated|choice|solution|product|service|brand)\b/gi,
      /\bnumber\s*one\s*(rated|choice|solution|product)\b/gi,
      /\bworld'?s?\s*(best|leading|finest|greatest)\b/gi,
    ],
    suggestion: 'Qualify superlative claims with source, date, and methodology. Example: "Rated #1 by [Source] in [Year]"',
    regulation: 'FTC Advertising Guidelines',
  },
  {
    id: 'misleading-free',
    category: 'misleading_claims',
    name: 'Misleading Free Offers',
    description: '"Free" claims that may have hidden costs or conditions',
    severity: 'high',
    patterns: [
      /\bfree\b(?!.*\b(no\s+credit\s+card|no\s+obligation|no\s+strings|conditions\s+apply)\b)/gi,
      /\bcompletely\s+free\b/gi,
      /\b(free|$0)\s*(trial|sample|gift|bonus)\b/gi,
    ],
    suggestion: 'Clearly disclose all conditions, requirements, or future charges associated with "free" offers.',
    regulation: 'FTC Free Offers Rule',
  },

  // Unsubstantiated Claims
  {
    id: 'unsubstantiated-clinical',
    category: 'unsubstantiated_claims',
    name: 'Clinical Study Claims',
    description: 'References to clinical studies or scientific proof without citation',
    severity: 'critical',
    patterns: [
      /\b(clinically|scientifically|medically)\s*(proven|tested|shown|demonstrated)\b/gi,
      /\b(studies|research|trials)\s*(show|prove|demonstrate|confirm)\b/gi,
      /\bdoctors?\s*(recommend|approve|endorse)\b/gi,
      /\blab(oratory)?\s*tested\b/gi,
    ],
    suggestion: 'Provide specific study citations including source, date, sample size, and methodology.',
    regulation: 'FTC Substantiation Doctrine',
  },
  {
    id: 'unsubstantiated-statistics',
    category: 'unsubstantiated_claims',
    name: 'Unattributed Statistics',
    description: 'Percentage claims or statistics without source',
    severity: 'high',
    patterns: [
      /\b\d{1,3}%\s*(of\s+)?(users?|customers?|people|clients?|patients?)\s*(say|report|agree|saw|experienced|noticed)\b/gi,
      /\b(9\s*out\s*of\s*10|8\s*out\s*of\s*10)\b/gi,
      /\bstatistics\s+show\b/gi,
    ],
    suggestion: 'Include source, sample size, date, and methodology for all statistics.',
    regulation: 'FTC Truth in Advertising',
  },

  // Pricing Issues
  {
    id: 'pricing-hidden',
    category: 'pricing_issues',
    name: 'Hidden Pricing',
    description: 'Pricing that may hide additional fees or conditions',
    severity: 'high',
    patterns: [
      /\bstarting\s*(at|from)\s*\$?\d/gi,
      /\bas\s+low\s+as\s*\$?\d/gi,
      /\bfrom\s+only\s*\$?\d/gi,
      /\$/gi, // Flag any price to check for hidden fees disclosure
    ],
    suggestion: 'Clearly display all fees, conditions, and the total cost. Use "starting at" only with clear disclosure of price range.',
    regulation: 'FTC Pricing Guidelines',
  },
  {
    id: 'pricing-comparison',
    category: 'pricing_issues',
    name: 'Price Comparison Claims',
    description: 'Comparative pricing without substantiation',
    severity: 'medium',
    patterns: [
      /\bsave\s*(up\s+to\s+)?\d+%/gi,
      /\b\d+%\s*(off|discount|savings?)\b/gi,
      /\bcompared?\s+to\s+(retail|competitors?|others?)\b/gi,
      /\b(was|originally|regularly)\s*\$\d+/gi,
    ],
    suggestion: 'Substantiate comparison prices with actual market data. Disclose the basis for comparison.',
    regulation: 'FTC Price Comparison Guidelines',
  },

  // Missing Disclaimers
  {
    id: 'disclaimer-affiliate',
    category: 'disclaimer_missing',
    name: 'Affiliate Disclosure Missing',
    description: 'Potential affiliate content without disclosure',
    severity: 'high',
    patterns: [
      /\b(affiliate\s+link|partner\s+link|sponsored)\b/gi,
      /\bwe\s+(may\s+)?earn\s+(a\s+)?commission\b/gi,
      /\b(click|use)\s+(this|my|our)\s+link\b/gi,
    ],
    suggestion: 'Add clear affiliate disclosure: "This post contains affiliate links. We may earn a commission at no extra cost to you."',
    regulation: 'FTC Endorsement Guidelines',
  },
  {
    id: 'disclaimer-results',
    category: 'disclaimer_missing',
    name: 'Results Disclaimer Missing',
    description: 'Claims of results without typical results disclaimer',
    severity: 'medium',
    patterns: [
      /\b(lost|lose)\s+\d+\s*(lbs?|pounds?|kg|kilos?)\b/gi,
      /\b(made|earned|earn)\s*\$[\d,]+\b/gi,
      /\b(results|outcomes?)\s+(may\s+)?vary\b/gi,
      /\breal\s+(results|customers?|stories)\b/gi,
    ],
    suggestion: 'Add disclaimer: "Results may vary. Individual results depend on many factors."',
    regulation: 'FTC Testimonial Guidelines',
  },

  // Prohibited Terms
  {
    id: 'prohibited-cure',
    category: 'prohibited_terms',
    name: 'Cure Claims',
    description: 'Claims of curing diseases or conditions',
    severity: 'critical',
    patterns: [
      /\b(cure[sd]?|curing|heal[sd]?|healing)\s+(disease|cancer|diabetes|illness|condition)\b/gi,
      /\b(eliminate|eradicate|destroy)[sd]?\s+(disease|virus|bacteria|cancer)\b/gi,
      /\bpermanent\s+(cure|solution|fix|remedy)\b/gi,
    ],
    suggestion: 'Remove cure claims. Use "may help support" or "traditionally used for" instead.',
    regulation: 'FDA Drug Claims Regulations',
  },
  {
    id: 'prohibited-miracle',
    category: 'prohibited_terms',
    name: 'Miracle Language',
    description: 'Use of exaggerated "miracle" terminology',
    severity: 'high',
    patterns: [
      /\b(miracle|magical|magic|revolutionary|breakthrough)\s*(product|solution|cure|treatment|formula)\b/gi,
      /\bsecret\s*(formula|ingredient|method|technique)\b/gi,
      /\binstant\s*(results?|cure|relief|fix|solution)\b/gi,
    ],
    suggestion: 'Use factual language instead of exaggerated claims. Focus on specific, verifiable benefits.',
    regulation: 'FTC Deceptive Advertising Standards',
  },

  // Urgency Manipulation
  {
    id: 'urgency-false',
    category: 'urgency_manipulation',
    name: 'False Urgency',
    description: 'Potentially false urgency or scarcity claims',
    severity: 'medium',
    patterns: [
      /\b(limited\s+time|act\s+now|hurry|last\s+chance|ending\s+soon)\b/gi,
      /\b(only\s+)?\d+\s*(left|remaining|available|in\s+stock)\b/gi,
      /\b(offer|deal|sale)\s+(expires?|ends?)\s+(soon|today|tonight|midnight)\b/gi,
      /\bdon'?t\s+miss\s+(out|this)\b/gi,
    ],
    suggestion: 'Only use urgency claims when genuinely true. Provide specific end dates for time-limited offers.',
    regulation: 'FTC Deceptive Practices',
  },
  {
    id: 'urgency-fomo',
    category: 'urgency_manipulation',
    name: 'FOMO Tactics',
    description: 'Fear of missing out manipulation',
    severity: 'low',
    patterns: [
      /\beveryone\s+(is\s+)?(buying|getting|using|joining)\b/gi,
      /\bselling\s+fast\b/gi,
      /\b(popular|trending|viral|selling\s+out)\b/gi,
      /\bbefore\s+it'?s?\s+(gone|too\s+late|sold\s+out)\b/gi,
    ],
    suggestion: 'Ensure popularity claims are substantiated with data. Avoid psychological pressure tactics.',
    regulation: 'Consumer Protection Standards',
  },

  // Testimonial Issues
  {
    id: 'testimonial-unverified',
    category: 'testimonial_issues',
    name: 'Unverified Testimonials',
    description: 'Testimonials that may not represent typical results',
    severity: 'medium',
    patterns: [
      /[""][^""]*[""].*[-–—]\s*[A-Z][a-z]+/g,
      /\b(testimonial|review|feedback)\s+from\b/gi,
      /\bcustomer\s+(said|says|wrote|reports?)\b/gi,
      /\b(real\s+)?customer\s+(stories|reviews?|testimonials?)\b/gi,
    ],
    suggestion: 'Ensure testimonials are genuine and include "Results may vary" disclaimer.',
    regulation: 'FTC Endorsement Guides',
  },
  {
    id: 'testimonial-celebrity',
    category: 'testimonial_issues',
    name: 'Celebrity/Influencer Endorsement',
    description: 'Celebrity mentions that may require disclosure',
    severity: 'high',
    patterns: [
      /\b(endorsed|recommended|used|loved)\s+by\s+[A-Z][a-z]+\s+[A-Z][a-z]+/g,
      /\bas\s+seen\s+(on|in)\s+(TV|television|magazine|news)\b/gi,
      /\bfeatured\s+(on|in)\s+[A-Z]/g,
    ],
    suggestion: 'Disclose material connections with endorsers. Celebrity endorsements must reflect genuine use and opinion.',
    regulation: 'FTC Endorsement Guidelines',
  },

  // Environmental Claims
  {
    id: 'environmental-green',
    category: 'environmental_claims',
    name: 'Greenwashing',
    description: 'Environmental claims that may be unsubstantiated',
    severity: 'high',
    patterns: [
      /\b(eco-?friendly|environmentally\s+friendly|green|sustainable|carbon\s+neutral)\b/gi,
      /\b(100%|fully)\s*(natural|organic|biodegradable|recyclable)\b/gi,
      /\b(save[sd]?\s+the\s+(planet|earth|environment))\b/gi,
      /\bzero\s*(carbon|emissions?|waste)\b/gi,
    ],
    suggestion: 'Substantiate environmental claims with certifications or data. Be specific about which aspects are eco-friendly.',
    regulation: 'FTC Green Guides',
  },

  // Health Claims
  {
    id: 'health-weight',
    category: 'health_claims',
    name: 'Weight Loss Claims',
    description: 'Weight loss claims that may be unrealistic',
    severity: 'critical',
    patterns: [
      /\blose\s+\d+\s*(lbs?|pounds?|kg)\s*(in|within|after)?\s*\d*\s*(days?|weeks?|month)?\b/gi,
      /\b(rapid|fast|quick|instant)\s+weight\s+loss\b/gi,
      /\bno\s+(diet|exercise)\s+(needed|required|necessary)\b/gi,
      /\bburn\s+fat\s+(fast|quickly|instantly)\b/gi,
    ],
    suggestion: 'Weight loss claims must be substantiated. Include "Results vary based on diet and exercise."',
    regulation: 'FTC Weight Loss Advertising Guidelines',
  },
  {
    id: 'health-supplement',
    category: 'health_claims',
    name: 'Supplement Health Claims',
    description: 'Health benefit claims for supplements',
    severity: 'high',
    patterns: [
      /\b(boost[sd]?|improve[sd]?|enhance[sd]?)\s*(immunity|immune\s+system|brain|memory|energy)\b/gi,
      /\b(anti-?aging|anti-?inflammatory|antioxidant)\s*(benefits?|properties|effects?)\b/gi,
      /\b(detox|cleanse|purify)\s*(your)?\s*(body|system|liver|kidney)\b/gi,
    ],
    suggestion: 'Add FDA disclaimer: "These statements have not been evaluated by the FDA. Not intended to diagnose, treat, cure, or prevent any disease."',
    regulation: 'DSHEA / FDA Regulations',
  },

  // Financial Claims
  {
    id: 'financial-income',
    category: 'financial_claims',
    name: 'Income Claims',
    description: 'Claims about potential income or earnings',
    severity: 'critical',
    patterns: [
      /\b(make|earn|generate)\s*\$[\d,]+\s*(per|a|each)\s*(day|week|month|year)?\b/gi,
      /\b(passive|residual)\s+income\b/gi,
      /\b(financial|money)\s+freedom\b/gi,
      /\bget\s+rich\b/gi,
      /\bquit\s+your\s+job\b/gi,
    ],
    suggestion: 'Include income disclaimer with typical results. Provide verifiable income documentation.',
    regulation: 'FTC Business Opportunity Rule',
  },
  {
    id: 'financial-guaranteed',
    category: 'financial_claims',
    name: 'Guaranteed Returns',
    description: 'Claims of guaranteed financial returns',
    severity: 'critical',
    patterns: [
      /\bguaranteed\s+(returns?|income|profit|ROI)\b/gi,
      /\b(risk-?free|no\s+risk)\s+(investment|opportunity)\b/gi,
      /\b\d+%\s*(guaranteed|annual|monthly)\s*(return|ROI|yield)\b/gi,
    ],
    suggestion: 'Remove guaranteed return claims. All investments carry risk - disclose this clearly.',
    regulation: 'SEC/FTC Investment Advertising Rules',
  },

  // Data Privacy
  {
    id: 'privacy-collection',
    category: 'data_privacy',
    name: 'Data Collection Notice',
    description: 'Content that implies data collection without disclosure',
    severity: 'medium',
    patterns: [
      /\b(sign\s+up|subscribe|register|join)\s+(for|to|now)\b/gi,
      /\b(enter|submit)\s+(your)?\s*(email|phone|info|information)\b/gi,
      /\bwe'?ll\s+(send|email|contact)\b/gi,
    ],
    suggestion: 'Include privacy policy link and data usage disclosure near sign-up forms.',
    regulation: 'GDPR / CCPA / CAN-SPAM',
  },

  // Comparative Advertising
  {
    id: 'comparative-unsubstantiated',
    category: 'comparative_advertising',
    name: 'Unsubstantiated Comparison',
    description: 'Comparative claims without substantiation',
    severity: 'high',
    patterns: [
      /\bbetter\s+than\s+([A-Z][a-z]+|the\s+competition|competitors?|others?|the\s+rest)\b/gi,
      /\bunlike\s+(other|competitor|[A-Z][a-z]+)\s*(products?|brands?|companies?)?\b/gi,
      /\b(outperforms?|beats?|exceeds?)\s+(all|every|any)\s*(other)?\b/gi,
    ],
    suggestion: 'Substantiate comparative claims with objective data. Consider naming specific competitors carefully.',
    regulation: 'Lanham Act / Comparative Advertising Guidelines',
  },

  // Target Audience Issues
  {
    id: 'audience-children',
    category: 'target_audience',
    name: 'Child-Directed Marketing',
    description: 'Content that may be targeting children',
    severity: 'high',
    patterns: [
      /\b(kids?|children|child|teen|teenager|young|youth)\s*(love|will\s+love|friendly)\b/gi,
      /\b(fun\s+for|great\s+for|perfect\s+for)\s*(kids?|children|the\s+whole\s+family)\b/gi,
    ],
    suggestion: 'Ensure COPPA compliance for child-directed content. Obtain parental consent for data collection.',
    regulation: 'COPPA',
  },
];

/**
 * Get rules by category
 */
export function getRulesByCategory(category: string): ComplianceRule[] {
  return COMPLIANCE_RULES.filter((rule) => rule.category === category);
}

/**
 * Get rules by severity
 */
export function getRulesBySeverity(severity: string): ComplianceRule[] {
  return COMPLIANCE_RULES.filter((rule) => rule.severity === severity);
}
