# Claude Ads Web

A comprehensive advertising audit and optimization platform built with Next.js 16, TypeScript, and Tailwind CSS v4.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.18-38B2AC)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

### 🎯 Comprehensive Audit System
- **Multi-step form** for collecting business information and platform selection
- **190+ audit checks** across 5 major advertising platforms
- **Weighted scoring system** with 0-100 Health Score and letter grades (A-F)
- **Detailed findings** organized by severity (Critical, High, Medium, Low)

### 📊 Supported Platforms
- **Google Ads** (74 checks) - Search, PMax, Display, YouTube, Demand Gen
- **Meta Ads** (46 checks) - Facebook, Instagram, Advantage+ Shopping
- **LinkedIn Ads** (25 checks) - B2B targeting, Lead Gen, TLA
- **TikTok Ads** (25 checks) - Creative-first, Smart+, TikTok Shop
- **Microsoft Ads** (20 checks) - Bing, Copilot, Import validation

### 📈 Results Dashboard
- **Health Score** with color-coded grade visualization
- **Quick Wins** section for easy implementation
- **Prioritized Action Plan** with effort levels and expected impact
- **Category Breakdown** showing performance by audit category
- **Top Recommendations** extracted from findings

### 💡 Strategy Planning Tool
Industry-specific templates for:
- **SaaS** - Trial signups, Google + LinkedIn focus
- **E-commerce** - ROAS optimization, PMax + Shopping
- **Local Service** - Phone calls, Local Services Ads
- **B2B Enterprise** - Pipeline generation, LinkedIn ABM

## Tech Stack

- **Framework**: Next.js 16.1.6 with App Router
- **Language**: TypeScript 5.9.3
- **Styling**: Tailwind CSS 4.1.18
- **State Management**: Zustand 5.0.11
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Package Manager**: npm

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/avinash-dangi/claude-ads-web.git
cd claude-ads-web

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Project Structure

```
claude-ads-web/
├── app/                          # Next.js App Router pages
│   ├── (audit)/                 # Audit-related pages
│   │   ├── audit/              # Multi-step audit form
│   │   │   ├── google-ads/     # Platform-specific pages
│   │   │   ├── meta-ads/
│   │   │   └── ...
│   │   └── results/            # Results dashboard
│   ├── (plan)/                 # Strategy planning
│   └── page.tsx                # Landing page
├── components/                  # React components
│   ├── audit/                  # Audit-specific components
│   │   ├── results/           # Results dashboard components
│   │   └── ...
│   └── ui/                     # shadcn/ui components
├── data/                       # Static data and checklists
│   └── checklists/            # Platform audit checklists
├── lib/                        # Utilities and helpers
│   ├── scoring/               # Scoring algorithms
│   └── utils/                 # Helper functions
├── store/                      # Zustand state management
├── types/                      # TypeScript type definitions
└── public/                     # Static assets
```

## Key Components

### Audit Form
Multi-step wizard with:
1. Business information collection
2. Platform selection
3. Account access method
4. Review and submission

### Results Dashboard
- Overall health score with grade
- Severity-based findings breakdown
- Prioritized action plan
- Category performance analysis
- Quick wins identification

### Platform Pages
Detailed information about each platform's audit:
- Total checks and categories
- Key focus areas
- Audit duration estimates
- Platform-specific features

### Strategy Planner
Industry-specific recommendations including:
- Recommended platforms and budget allocation
- Campaign structure suggestions
- KPI targets
- Targeting and creative guidelines

## Scoring System

The audit scoring system uses weighted categories and severity multipliers:

- **Severity Weights**:
  - Critical: 1.0
  - High: 0.7
  - Medium: 0.4
  - Low: 0.2

- **Grades**:
  - A (90-100): Excellent - Minor optimizations only
  - B (75-89): Good - Some improvement opportunities
  - C (60-74): Fair - Notable issues need attention
  - D (40-59): Poor - Significant problems present
  - F (<40): Critical - Urgent intervention required

## Google Ads Audit Categories

| Category | Weight | Checks |
|----------|--------|--------|
| Conversion Tracking | 25% | 11 |
| Wasted Spend / Negatives | 20% | 8 |
| Account Structure | 15% | 12 |
| Keywords & Quality Score | 15% | 8 |
| Ads & Assets | 15% | 12 |
| Settings & Targeting | 10% | 12 |
| Performance Max | - | 5 |

## Meta Ads Audit Categories

| Category | Weight | Checks |
|----------|--------|--------|
| Pixel / CAPI Health | 30% | 10 |
| Creative Diversity & Fatigue | 30% | 12 |
| Account Structure | 20% | 18 |
| Audience & Targeting | 20% | 6 |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgments

Built with [Claude Code](https://claude.ai/claude-code) - AI-powered development assistant.

## Contact

Avinash Dangi - [@avinash-dangi](https://github.com/avinash-dangi)

Project Link: [https://github.com/avinash-dangi/claude-ads-web](https://github.com/avinash-dangi/claude-ads-web)

---

**Note**: This is a demonstration application showcasing audit capabilities. For production use, additional features like authentication, database integration, and actual API connections would be required.
