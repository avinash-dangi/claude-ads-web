# Product Roadmap: From Tool to Platform

## Phase 1: The "Smart" Tool (Current)
*Goal: A high-utility, standalone tool that provides value immediately without signup.*
- [x] Comprehensive Google/Meta Audit Checklists
- [x] Weighted Scoring Engine
- [x] Interactive Questionnaire
- [x] PDF Report Generation
- [x] Strategy Planner

## Phase 2: Data Persistence & User Accounts
*Goal: Allow users to save their work and track progress over time.*
- [ ] **Authentication**: Implement Clerk/Supabase Auth.
- [ ] **Dashboard V2**: Show "History" of past audits.
- [ ] **Save Drafts**: Allow partial completion of questionnaires.
- [ ] **Multi-Session**: Switch between different businesses (Projects).

## Phase 3: The "One-Click" Audit (API Integration)
*Goal: Remove the friction of manual data entry.*
- [ ] **Google Ads OAuth**: "Sign in with Google" to read ad data.
- [ ] **Automated Data Fetching**: Pull exact spend, CTR, Conversion data via API.
- [ ] **Meta Marketing API**: Connect Facebook/Instagram ad accounts.
- [ ] **Hybrid Audits**: Pre-fill 80% of the questionnaire from API, ask user for the remaining 20% (strategy/subjective questions).

## Phase 4: Pro Features & Monetization
*Goal: Generate revenue through premium capabilities.*
- [ ] **Stripe Integration**: Checkout for Pro/Agency tiers.
- [ ] **Whitelabel Reports**: Remove "Claude Ads" branding, add Agency logo.
- [ ] **Competitor Intelligence**: Integrate 3rd party APIs (SpyFu/Semrush) for competitor data.
- [ ] **Scheduled Audits**: Weekly health checks sent via email.

## Phase 5: The "AI Consultant" (Agentic Features)
*Goal: Use LLMs to not just finding problems, but fixing them.*
- [ ] **Ad Copy Generator**: Rewrite "Poor" ads using high-performing benchmarks.
- [ ] **Structural Refactoring**: Generate an uploadable CSV to fix Account Structure.
- [ ] **Conversation Mode**: Chat with your ad data ("Why did CPA spike yesterday?").

## Implementation Priorities (Next Steps)

1.  **Refine "Manual" Audit**: Complete the content for LinkedIn, TikTok, Microsoft.
2.  **Mock API Data**: Create a "Demo Mode" that populates the dashboard with fake API data to visualize the end state.
3.  **Database Setup**: Initialize Supabase project and connect it.
