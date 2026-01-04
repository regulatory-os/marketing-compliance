# Analyse de Conformité Marketing AMF

Outil standalone d'analyse de conformité des documents marketing financiers selon la réglementation AMF (Autorité des Marchés Financiers). Toute l'analyse s'effectue localement dans votre navigateur - aucune donnée n'est envoyée à un serveur.

![Marketing Compliance Analyzer](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)
![React](https://img.shields.io/badge/React-18.2-blue.svg)

🇫🇷 **Français** | [English](#english-version)

## Fonctionnalités

- **Analyse 100% locale** - Tout le traitement s'effectue dans votre navigateur. Aucune donnée ne quitte votre machine.
- **Réglementation AMF** - Conforme aux textes réglementaires français : DOC-2011-24, DOC-2010-05, ESMA, etc.
- **Workflow en 3 étapes** - Upload → Qualification → Analyse détaillée
- **Qualification automatique** - Détection du type de produit, public cible et textes applicables
- **Résultats détaillés** - Score de conformité, groupement par texte/statut/criticité
- **Bilingue** - Interface disponible en français et en anglais

## Textes Réglementaires Couverts

| Code | Titre | Description |
|------|-------|-------------|
| DOC-2011-24 | Communications publicitaires OPC | Placements collectifs (OPCVM, FIA, SCPI, etc.) |
| DOC-2010-05 | Instruments complexes | Produits structurés, EMTN, titres de créance |
| ESMA34-45-1272 | Guidelines MiFID II | Communications marketing instruments financiers |
| DOC-2020-03 | ESG / Finance durable | Allégations extra-financières et durables |

## Catégories de Produits Analysés

- **OPCVM** - Organismes de Placement Collectif en Valeurs Mobilières
- **FIA** - Fonds d'Investissement Alternatifs
- **SCPI / OPCI** - Immobilier collectif
- **ETF** - Fonds indiciels cotés
- **EMTN** - Euro Medium Term Notes
- **Produits structurés** - Certificats, autocalls, etc.

## Démarrage Rapide

### Prérequis

- Node.js 18+
- npm ou yarn

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/regulatory-os/marketing-compliance.git
cd marketing-compliance

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera disponible sur `http://localhost:5173`.

### Build Production

```bash
# Compiler l'application
npm run build

# Prévisualiser le build
npm run preview
```

## Structure du Projet

```
marketing-compliance/
├── public/
│   └── vite.svg
├── src/
│   ├── components/           # Composants React UI
│   │   ├── ContentInput.tsx     # Zone de saisie du document
│   │   ├── QualificationReview.tsx  # Révision de la qualification
│   │   ├── AnalysisResults.tsx  # Affichage des résultats
│   │   ├── ScoreCard.tsx        # Affichage du score
│   │   ├── FindingCard.tsx      # Carte de constat
│   │   ├── LanguageToggle.tsx   # Bascule FR/EN
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useMarketingAnalysis.ts  # Hook principal d'analyse
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts             # Types TypeScript AMF
│   ├── utils/
│   │   ├── constants.ts         # Configuration et traductions
│   │   ├── mockAnalyzer.ts      # Moteur d'analyse simulé
│   │   ├── findingGroupUtils.ts # Utilitaires de groupement
│   │   └── index.ts
│   ├── App.tsx                  # Composant principal
│   ├── main.tsx                 # Point d'entrée
│   └── index.css                # Styles (Tailwind)
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## Utilisation

### Workflow en 3 étapes

1. **Document** - Collez ou uploadez votre document marketing
2. **Qualification** - Vérifiez/ajustez le type de produit, public cible et caractéristiques détectées
3. **Résultats** - Consultez le score de conformité, les constats et actions correctives

### Statuts des Constats

| Statut | Description |
|--------|-------------|
| CONFORME | L'obligation est respectée |
| NON_CONFORME | Non-conformité détectée nécessitant une correction |
| AMELIORATION | Suggestion d'amélioration (non bloquante) |
| NON_APPLICABLE | Obligation non applicable au contexte |
| NON_VERIFIABLE | Impossible à vérifier sans informations supplémentaires |

### Niveaux de Criticité

| Niveau | Description |
|--------|-------------|
| Critique | Risque élevé de sanction AMF |
| Majeur | Non-conformité significative |
| Mineur | Point d'attention |
| Info | Information contextuelle |

## Utilisation Programmatique

```typescript
import { simulateQualification, simulateAnalysis } from './src/utils';

const content = "Document promotionnel OPCVM...";

// Étape 1 : Qualification
const qualification = simulateQualification(content);
console.log('Type produit:', qualification.type_produit.categorie);
console.log('Textes applicables:', qualification.textes_applicables);

// Étape 2 : Analyse
const result = simulateAnalysis(content, qualification);
console.log('Score:', result.rapport.score_conformite);
console.log('Non-conformités:', result.rapport.nb_non_conformes);
```

## Version Standalone vs Hosted

Ceci est la **version standalone** - 100% côté client sans base de données.

| Fonctionnalité | Standalone | Hosted (regulatory-os) |
|----------------|------------|------------------------|
| Analyse | Simulée (locale) | IA Claude (Supabase) |
| Stockage | Mémoire uniquement | Base de données |
| Historique | Session uniquement | Permanent |
| Précision | Heuristiques | IA avancée |
| Coût | Gratuit | API usage |

## Contribution

Les contributions sont les bienvenues !

1. **Signaler des bugs** - Ouvrez une issue
2. **Proposer des améliorations** - Soumettez une PR
3. **Ajouter des règles** - Contribuez de nouvelles obligations
4. **Améliorer la doc** - Aidez à enrichir la documentation

### Développement

```bash
# Linting
npm run lint

# Vérification des types
npm run type-check

# Build
npm run build
```

## Licence

MIT License - voir [LICENSE](LICENSE) pour les détails.

## Avertissement

**Cet outil est fourni à titre d'aide à la décision uniquement et ne constitue pas un conseil juridique.**

Les réglementations marketing varient selon les produits et les situations. Consultez toujours un professionnel qualifié avant de publier du contenu marketing. L'analyse fournie est basée sur des heuristiques et peut ne pas couvrir toutes les obligations applicables.

---

# English Version

# AMF Marketing Compliance Analyzer

Standalone tool for analyzing financial marketing documents according to AMF (French Financial Markets Authority) regulations. All analysis happens locally in your browser - no data is sent to any server.

## Features

- **100% Local Analysis** - All processing happens in your browser. No data leaves your machine.
- **AMF Regulations** - Compliant with French regulatory texts: DOC-2011-24, DOC-2010-05, ESMA, etc.
- **3-Step Workflow** - Upload → Qualification → Detailed analysis
- **Automatic Qualification** - Product type, target audience, and applicable texts detection
- **Detailed Results** - Compliance score, grouping by text/status/criticality
- **Bilingual** - Interface available in French and English

## Quick Start

```bash
git clone https://github.com/regulatory-os/marketing-compliance.git
cd marketing-compliance
npm install
npm run dev
```

See French documentation above for detailed instructions.

## Disclaimer

**This tool is for decision support only and does not constitute legal advice.**

Always consult with a qualified professional before publishing marketing content.

---

Made with care by the [regulatory-os](https://github.com/regulatory-os) community
