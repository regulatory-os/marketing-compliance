# Marketing Compliance Analyzer

A standalone, privacy-first tool for analyzing marketing content for regulatory compliance. All analysis happens locally in your browser - no data is sent to any server.

![Marketing Compliance Analyzer](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)
![React](https://img.shields.io/badge/React-18.2-blue.svg)

## Features

- **100% Local Analysis** - All processing happens in your browser. No data leaves your machine.
- **Comprehensive Rule Set** - 30+ rules covering FTC, GDPR, CAN-SPAM, FDA, and more.
- **Real-time Highlighting** - See issues highlighted directly in your content.
- **Severity Scoring** - Get a compliance score from 0-100 with categorized issues.
- **Export Reports** - Download or copy compliance reports in Markdown format.
- **Analysis History** - Keep track of your recent analyses (stored in memory only).

## Compliance Categories

| Category | Description |
|----------|-------------|
| Misleading Claims | Absolute guarantees, unqualified superlatives |
| Unsubstantiated Claims | Clinical studies, statistics without sources |
| Pricing Issues | Hidden fees, misleading price comparisons |
| Missing Disclaimers | Affiliate disclosures, results disclaimers |
| Prohibited Terms | Cure claims, miracle language |
| Urgency Manipulation | False scarcity, FOMO tactics |
| Testimonial Issues | Unverified testimonials, celebrity endorsements |
| Environmental Claims | Greenwashing, unsubstantiated eco-claims |
| Health Claims | Weight loss promises, supplement claims |
| Financial Claims | Income promises, guaranteed returns |
| Data Privacy | Collection notices, consent requirements |
| Comparative Advertising | Unsubstantiated competitor comparisons |

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/regulatory-os/marketing-compliance.git
cd marketing-compliance

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`.

### Build for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## Project Structure

```
marketing-compliance/
├── public/
│   └── vite.svg              # App icon
├── src/
│   ├── components/           # React UI components
│   │   ├── ContentInput.tsx  # Text input area
│   │   ├── ScoreCard.tsx     # Compliance score display
│   │   ├── IssueList.tsx     # List of found issues
│   │   ├── HighlightedContent.tsx  # Content with highlights
│   │   ├── ExportButton.tsx  # Report export functionality
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useComplianceAnalysis.ts  # Main analysis hook
│   │   └── index.ts
│   ├── types/
│   │   ├── compliance.ts     # TypeScript interfaces
│   │   └── index.ts
│   ├── utils/
│   │   ├── analyzer.ts       # Core analysis engine
│   │   ├── complianceRules.ts  # Compliance rule definitions
│   │   └── index.ts
│   ├── App.tsx               # Main application component
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles (Tailwind)
├── docs/
│   └── schema.sql            # Optional SQL schema reference
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## Usage

### Basic Usage

1. **Enter Content**: Paste or type your marketing content in the text area.
2. **Select Content Type**: Choose the type of content (Email, Social Media, etc.).
3. **Analyze**: Click "Analyze Compliance" to run the analysis.
4. **Review Results**: See your compliance score, highlighted issues, and recommendations.
5. **Export**: Download or copy the report for your records.

### Programmatic Usage

You can also use the analysis engine programmatically:

```typescript
import { analyzeContent } from './src/utils';

const content = "Get 100% guaranteed results with our miracle formula!";
const options = {
  contentType: 'advertising',
  strictMode: false,
  includeInfoLevel: true,
};

const result = analyzeContent(content, options);

console.log(`Compliance Score: ${result.score}/100`);
console.log(`Issues Found: ${result.issues.length}`);

result.issues.forEach(issue => {
  console.log(`- [${issue.severity}] ${issue.title}: ${issue.matchedText}`);
});
```

### Custom Rules

Add custom rules by extending `complianceRules.ts`:

```typescript
import { ComplianceRule } from '@/types';

const customRule: ComplianceRule = {
  id: 'custom-rule-1',
  category: 'misleading_claims',
  name: 'Custom Check',
  description: 'Description of what this rule checks',
  severity: 'medium',
  patterns: [/your-regex-pattern/gi],
  suggestion: 'How to fix this issue',
  regulation: 'Applicable regulation',
};
```

## Regulations Covered

This tool checks content against guidelines from:

- **FTC (Federal Trade Commission)**
  - Truth in Advertising
  - Endorsement Guidelines
  - Free Offers Rule
  - Business Opportunity Rule

- **FDA (Food and Drug Administration)**
  - Drug Claims Regulations
  - DSHEA (Dietary Supplements)

- **Privacy Regulations**
  - GDPR (General Data Protection Regulation)
  - CCPA (California Consumer Privacy Act)
  - CAN-SPAM Act

- **Industry Standards**
  - NAD (National Advertising Division)
  - FTC Green Guides
  - COPPA (Children's Online Privacy)

## Severity Levels

| Level | Color | Impact | Description |
|-------|-------|--------|-------------|
| Critical | Red | -25 points | Serious violations requiring immediate attention |
| High | Orange | -15 points | Significant issues that should be addressed |
| Medium | Yellow | -8 points | Moderate concerns worth reviewing |
| Low | Blue | -3 points | Minor suggestions for improvement |
| Info | Gray | -1 point | Informational notes |

## Standalone vs Database Version

This is the **standalone version** - 100% client-side with no database required.

| Feature | Standalone | With Database |
|---------|------------|---------------|
| Analysis | Local (browser) | Local (browser) |
| Data Storage | In-memory only | Persistent (SQL) |
| History | Session only | Permanent |
| Custom Rules | Code changes | User-defined |
| Dependencies | None | Supabase/PostgreSQL |

For those who want to add persistence, see `docs/schema.sql` for a reference SQL schema compatible with Supabase/PostgreSQL.

## Contributing

We welcome contributions! Here's how you can help:

1. **Report Issues**: Found a bug or have a feature request? Open an issue.
2. **Submit PRs**: Fix bugs or add features by submitting a pull request.
3. **Add Rules**: Contribute new compliance rules for different regulations.
4. **Improve Docs**: Help improve documentation and examples.

### Development

```bash
# Run linting
npm run lint

# Type checking
npm run type-check

# Build
npm run build
```

## License

MIT License - see [LICENSE](LICENSE) for details.

## Disclaimer

**This tool is for informational purposes only and does not constitute legal advice.**

Marketing regulations vary by jurisdiction and industry. Always consult with a qualified legal professional before publishing marketing content. The analysis provided by this tool is based on general guidelines and may not cover all applicable regulations in your specific situation.

## Related Projects

- [regulatory-os](https://github.com/regulatory-os) - Open-source regulatory compliance tools
- [FTC Guidelines](https://www.ftc.gov/business-guidance/advertising-marketing) - Official FTC advertising guidance

---

Made with ❤️ by the [regulatory-os](https://github.com/regulatory-os) community
