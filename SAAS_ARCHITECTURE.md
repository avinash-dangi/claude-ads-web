# SaaS Architecture: Claude Ads Web

## overview
To transition from a static audit tool to a robust MicroSaaS, we need to introduce a backend, database, and authentication layer while maintaining the high performance of the Next.js frontend.

## Technology Stack Extensions

| Component | Current | Proposed SaaS Stack | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend** | Next.js 16 (App Router) | Next.js 16 (App Router) | Maintain current high-performance UI |
| **Auth** | None | **Clerk** or **Supabase Auth** | User management, social login (Google/LinkedIn) |
| **Database** | None (Local State) | **Supabase (PostgreSQL)** | Store user profiles, audit history, and reports |
| **API** | None | **Next.js Server Actions / API Routes** | Secure server-side operations |
| **Payments** | None | **Stripe** | Subscription management (Pro/Agency tiers) |
| **Ad APIs** | None | **Google Ads API**, **Meta Marketing API** | Automated data fetching (OAuth) |

## Data Model (Proposed)

### Users
- `id`: UUID
- `email`: string
- `tier`: 'free' | 'pro' | 'agency'
- `stripe_customer_id`: string

### Projects (for Agencies)
- `id`: UUID
- `owner_id`: UUID (FK)
- `name`: string (e.g., "Client X")
- `website`: string

### Audits
- `id`: UUID
- `project_id`: UUID (FK)
- `platform`: 'google' | 'meta' | 'linkedin' | ...
- `score`: number
- `data`: JSON (Full audit response payload)
- `created_at`: timestamp

## Integration Architecture

### OAuth Flow (The "Magic" Button)
Instead of manual questionnaires, we implement "Connect Google Ads":
1.  User clicks "Connect Account"
2.  Redirect to Google OAuth (Scope: `ads_read`)
3.  Callback to Next.js API Route
4.  Store Refresh Token (Encrypted) in Supabase

### Automated Grading Engine
The `lib/scoring` logic remains relevant but needs an adapter:
- **Current**: `Questionnaire Response` -> `Scoring Engine` -> `Result`
- **Future**: `API Response` -> `Transformer` -> `Normalized Response` -> `Scoring Engine` -> `Result`

This allows us to reuse the *same* scoring logic for both manual and automated audits.

## Security Considerations
- **Token Storage**: Ad platform tokens must be encrypted at rest.
- **Data Privacy**: Users rarely want ad performance data stored long-term.
    - *Policy*: Store "Scores" and "Findings" (metadata), but optionally discard raw data after report generation.
- **RAG for Analysis**: When using LLMs for qualitative analysis (e.g., "Review this ad copy"), ensure PII masking.
