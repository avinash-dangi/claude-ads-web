# Audit Questionnaire System

This document describes the interactive questionnaire system for capturing actual audit responses.

## Overview

The questionnaire replaces the previous "Account Access" step and provides a guided, question-by-question interface for users to answer audit checks. Instead of providing raw data exports, users now engage with a structured form that walks them through each check with clear guidance.

## User Flow

```
Step 1: Business Info
  ↓
Step 2: Select Platforms
  ↓
Step 3: Questionnaire (per platform)
  - Platform 1 questions
  - Platform 2 questions
  - etc.
  ↓
Step 4: Review
  ↓
Generate Report
```

## Architecture

### Store (`store/audit-store.ts`)

Extended Zustand store to track questionnaire state:

```typescript
// New fields
auditResponses: Map<Platform, AuditResult[]>  // Stores all responses per platform
currentPlatformForQuestionnaire: Platform | null  // Track which platform user is on

// New actions
setCurrentPlatformForQuestionnaire(platform)
addAuditResponse(platform, response)
updateAuditResponse(platform, checkId, response)
getAuditResponses(platform): AuditResult[]
```

### Components

#### `QuestionnaireStep` (`components/audit/QuestionnaireStep.tsx`)

The main questionnaire component that displays:

1. **Progress tracking**
   - Current question number (e.g., "Question 5 of 74")
   - Progress bar showing completion
   - Count of answered questions

2. **Check details**
   - Check title and ID
   - Severity badge (Critical/High/Medium/Low)
   - Category name
   - Description text (if available)

3. **Criteria guidance**
   - Three columns showing Pass/Warning/Fail criteria
   - Helps user understand what each status means

4. **Response capture**
   - Radio buttons for status selection:
     - ✓ Pass - Requirement is met
     - ⚠ Warning - Partially implemented or needs attention
     - ✗ Fail - Requirement is not met
     - — N/A - Not applicable to this setup
   - Optional notes field for additional context

5. **Navigation**
   - Previous button (disabled on first question)
   - Next button (advances through questions)
   - Cancel button (returns to platform selection)
   - Complete button (on final question)

### Data Flow

```
User selects platforms (Step 2)
  ↓
Click Next
  ↓
Set currentPlatformForQuestionnaire to first platform
  ↓
QuestionnaireStep renders
  ↓
User answers questions
  ↓
updateAuditResponse() saves to store
  ↓
User clicks Next/Previous to navigate
  ↓
On final question, click "Complete {Platform} Audit"
  ↓
Check if more platforms
  ↓
Load next platform OR advance to Review Step
```

## Response Structure

```typescript
interface AuditResult {
  checkId: string;           // e.g., "G01", "M01"
  status: CheckStatus;       // 'pass' | 'warning' | 'fail' | 'not-applicable'
  notes?: string;            // User-provided notes
  impact?: string;           // For future impact analysis
}
```

## Multi-Platform Handling

The questionnaire system handles multiple platforms by:

1. **Sequential loading**: After completing one platform's questionnaire, automatically loads the next selected platform
2. **Separate responses**: Each platform has its own response array in the store
3. **Progress preservation**: Responses are saved in the store as user navigates
4. **Review summary**: ReviewStep shows response counts per platform

Example flow for 3 selected platforms:
```
Google Ads: 74 checks → Complete
    ↓
Meta Ads: 46 checks → Complete
    ↓
LinkedIn Ads: 25 checks → Complete
    ↓
Move to Review Step
```

## Check Data

Checks are defined per-platform in the data folder:

**Google Ads** (`data/checklists/google-ads.ts`)
- 74 total checks
- 6 categories with weights
- Each check includes:
  - ID: Unique identifier (G01, G02, etc.)
  - Check: The question/requirement
  - Severity: Critical/High/Medium/Low
  - Category: Which category it belongs to
  - Pass/Warning/Fail: Criteria descriptions
  - Description: Detailed explanation

**Meta Ads** (`data/checklists/meta-ads.ts`)
- 46 total checks
- 4 categories
- Same structure as Google Ads

## UI Features

### Severity Color Coding
- **Critical**: Red border, red styling
- **High**: Orange border, orange styling
- **Medium**: Yellow border, yellow styling
- **Low**: Blue border, blue styling

### Progress Indicators
- **Progress bar**: Visual indication of completion
- **Question counter**: "X of Y" format
- **Answer counter**: "N answered" shows how many questions have responses

### Guidance System
The three-column criteria section helps users understand:
- What "passing" this check means
- What "warning" status indicates
- What "failing" means

### Accessibility
- Clear radio button options
- Descriptive labels for each option
- Large target areas for touch devices
- Keyboard navigation support

## Integration with Scoring

Once users complete the questionnaire and reach the Review step:

1. Responses are stored in `auditResponses` Map
2. ReviewStep displays summary of responses per platform:
   - Number of Pass, Warning, Fail, N/A responses
3. When generating report, scoring engine uses these responses:
   - Calculates weighted score based on severity and category weights
   - Generates findings based on failed/warning checks
   - Creates prioritized action plan

## Future Enhancements

### Conditional Logic
- Skip questions based on previous answers
- Show/hide questions based on business type or platform setup
- Dynamic questionnaires based on responses

### Smart Recommendations
- Show related checks after a failed check
- Suggest common fixes for failing checks
- Link to documentation or resources

### Progress Persistence
- Save responses to database
- Allow users to resume incomplete audits
- Track response history

### Bulk Import
- Pre-fill responses from API data
- Import CSV responses
- Match data exports to checks automatically

### Validation Rules
- Ensure internal consistency of responses
- Warn about unlikely response combinations
- Suggest related checks based on answers

## Testing

To test the questionnaire:

1. Navigate to `/audit`
2. Complete Step 1: Business Info
3. Complete Step 2: Select Platforms (select at least Google Ads)
4. Step 3 will show the questionnaire for Google Ads
5. Answer questions by selecting Pass/Warning/Fail/N/A
6. Optionally add notes
7. Click Previous/Next to navigate
8. Click "Complete Google Ads Audit" on final question
9. If more platforms selected, the next questionnaire will load
10. After all platforms, you'll be taken to Review step

## Code References

- **Store**: `/store/audit-store.ts:82-102`
- **Questionnaire Component**: `/components/audit/QuestionnaireStep.tsx`
- **Audit Form Page**: `/app/(audit)/audit/page.tsx:22-88` (flow logic)
- **Review Step**: `/components/audit/ReviewStep.tsx:18-35` (response display)
- **Check Data**: `/data/checklists/google-ads.ts`, `/data/checklists/meta-ads.ts`
- **Types**: `/types/audit.ts:1-35` (AuditResult, CheckStatus)

## Next Steps

1. **Evaluation Engine**: Build the scoring/evaluation system that processes responses
2. **Results Generation**: Convert responses to findings, recommendations, and quick wins
3. **PDF Export**: Generate PDF reports from responses and results
4. **API Integration**: Pull actual data from Google Ads/Meta/LinkedIn APIs
5. **Persistence**: Save audits to database for user dashboard
