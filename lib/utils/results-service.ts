import { Platform, AuditFormData } from '@/types/business';
import { AuditResult, MultiPlatformAudit, AuditReport, CheckStatus } from '@/types/audit';
import { googleAdsChecks, googleAdsCategories } from '@/data/checklists/google-ads';
import { metaAdsChecks, metaAdsCategories } from '@/data/checklists/meta-ads';
import { linkedinAdsChecks, linkedinAdsCategories } from '@/data/checklists/linkedin-ads';
import { tiktokAdsChecks, tiktokAdsCategories } from '@/data/checklists/tiktok-ads';
import { microsoftAdsChecks, microsoftAdsCategories } from '@/data/checklists/microsoft-ads';
import {
  calculatePlatformHealthScore,
  calculateCategoryScore,
  scoreToGrade,
  getSeverityColor,
} from '@/lib/scoring/scoring-algorithms';
import {
  generateFindings,
  enrichFindingWithContext,
  groupFindingsBySeverity,
  countFindingsBySeverity,
} from '@/lib/scoring/findings-generator';
import { extractQuickWins } from '@/lib/scoring/quick-wins-extractor';
import { generateActionPlan } from '@/lib/scoring/action-plan-generator';
import { AuditCheck, AuditCategory } from '@/types/audit';

const PLATFORM_CHECKS: Record<Platform, AuditCheck[]> = {
  'google-ads': googleAdsChecks,
  'meta-ads': metaAdsChecks,
  'linkedin-ads': linkedinAdsChecks,
  'tiktok-ads': tiktokAdsChecks,
  'microsoft-ads': microsoftAdsChecks,
};

const PLATFORM_CATEGORIES: Record<Platform, AuditCategory[]> = {
  'google-ads': googleAdsCategories,
  'meta-ads': metaAdsCategories,
  'linkedin-ads': linkedinAdsCategories,
  'tiktok-ads': tiktokAdsCategories,
  'microsoft-ads': microsoftAdsCategories,
};

interface GenerateReportOptions {
  formData: Partial<AuditFormData>;
  auditResponses: Map<Platform, AuditResult[]>;
  selectedPlatforms: Platform[];
}

/**
 * Generate a complete audit report from questionnaire responses
 */
export function generateAuditReport(options: GenerateReportOptions): MultiPlatformAudit {
  const { formData, auditResponses, selectedPlatforms } = options;

  // Generate report for each platform
  const platformReports: AuditReport[] = [];
  const allTopIssues: MultiPlatformAudit['topIssues'] = [];
  const allActionItems: MultiPlatformAudit['actionPlan'] = [];

  let totalScore = 0;
  let platformCount = 0;

  for (const platform of selectedPlatforms) {
    const checks = PLATFORM_CHECKS[platform];
    const categories = PLATFORM_CATEGORIES[platform];

    // Skip platforms with no checks
    if (!checks || checks.length === 0) continue;

    const responses = auditResponses.get(platform) || [];

    // Generate platform report
    const report = generatePlatformReport({
      platform,
      checks,
      categories,
      responses,
      businessType: formData.businessInfo?.type || 'generic',
    });

    platformReports.push(report);

    // Aggregate scores
    totalScore += report.score;
    platformCount++;

    // Collect top issues (limit to critical/high)
    const topIssues = report.findings.critical + report.findings.high;
    if (topIssues > 0) {
      allTopIssues.push({
        platform,
        checkId: '',
        issue: `${report.findings.critical} critical and ${report.findings.high} high severity issues`,
        priority: 'critical',
      });
    }

    // Collect action items
    allActionItems.push(...(report as any).actionItems || []);
  }

  // Calculate overall score
  const overallScore = platformCount > 0 ? Math.round(totalScore / platformCount) : 0;
  const overallGrade = scoreToGrade(overallScore);

  // Sort action items by priority
  const topActionPlan = allActionItems
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 15);

  return {
    overallScore,
    overallGrade,
    platformReports,
    topIssues: allTopIssues,
    actionPlan: topActionPlan,
  };
}

interface PlatformReportOptions {
  platform: Platform;
  checks: AuditCheck[];
  categories: AuditCategory[];
  responses: AuditResult[];
  businessType: string;
}

/**
 * Generate report for a single platform
 */
function generatePlatformReport(options: PlatformReportOptions): AuditReport {
  const { platform, checks, categories, responses, businessType } = options;

  // Map responses to checks for easier lookup
  const responseMap = new Map(responses.map((r) => [r.checkId, r]));

  // Validate we have responses
  if (responses.length === 0) {
    return {
      platform,
      date: new Date(),
      results: [],
      score: 0,
      grade: 'F',
      findings: { critical: 0, high: 0, medium: 0, low: 0 },
      recommendations: ['No responses provided for this platform'],
      quickWins: [],
    };
  }

  // Calculate category scores
  const categoryScores = categories.map((category) => {
    const categoryChecks = checks.filter((c) => c.category === category.name);
    const categoryResults = categoryChecks
      .map((check) => {
        const result = responseMap.get(check.id);
        return result ? { check, result } : null;
      })
      .filter((r) => r !== null) as Array<{ check: AuditCheck; result: AuditResult }>;

    return calculateCategoryScore(categoryResults, category);
  });

  // Calculate overall platform score
  const score = calculatePlatformHealthScore(categoryScores);
  const grade = scoreToGrade(score);

  // Generate findings
  const findings = generateFindings(responses, checks);
  const enrichedFindings = findings.map((f) =>
    enrichFindingWithContext(
      checks.find((c) => c.id === f.checkId)!,
      responses.find((r) => r.checkId === f.checkId)!
    )
  );

  // Count findings by severity
  const findingCounts = countFindingsBySeverity(enrichedFindings);

  // Extract quick wins
  const quickWins = extractQuickWins(enrichedFindings, checks);

  // Generate action plan
  const actionPlan = generateActionPlan(enrichedFindings, platform, businessType as any);

  // Create recommendations from action plan
  const recommendations = actionPlan.slice(0, 5).map((item) => item.description || item.title);

  return {
    platform,
    date: new Date(),
    results: responses,
    score: Math.round(score),
    grade,
    findings: {
      critical: findingCounts.critical,
      high: findingCounts.high,
      medium: findingCounts.medium,
      low: findingCounts.low,
    },
    recommendations,
    quickWins: quickWins.map((w) => `${w.description} (Est. effort: ${w.effort})`),
  };
}

/**
 * Get platform checklist by name
 */
export function getPlatformChecks(platform: Platform): AuditCheck[] {
  return PLATFORM_CHECKS[platform] || [];
}

/**
 * Get platform categories by name
 */
export function getPlatformCategories(platform: Platform): AuditCategory[] {
  return PLATFORM_CATEGORIES[platform] || [];
}

/**
 * Validate responses coverage for a platform
 */
export function validateResponsesCoverage(
  platform: Platform,
  responses: AuditResult[]
): { isValid: boolean; coverage: number; message: string } {
  const checks = getPlatformChecks(platform);
  if (checks.length === 0) {
    return { isValid: true, coverage: 100, message: 'No checks for this platform' };
  }

  const applicableResponses = responses.filter((r) => r.status !== 'not-applicable');
  const coverage = Math.round((applicableResponses.length / checks.length) * 100);

  if (coverage === 100) {
    return { isValid: true, coverage, message: 'All checks answered' };
  }

  if (coverage >= 80) {
    return { isValid: true, coverage, message: `${coverage}% of checks answered (recommended: 100%)` };
  }

  return {
    isValid: false,
    coverage,
    message: `Only ${coverage}% of checks answered. Please answer at least 80% of checks.`,
  };
}

/**
 * Get response statistics for platform
 */
export function getResponseStats(
  platform: Platform,
  responses: AuditResult[]
): { pass: number; warning: number; fail: number; notApplicable: number; total: number } {
  return {
    pass: responses.filter((r) => r.status === 'pass').length,
    warning: responses.filter((r) => r.status === 'warning').length,
    fail: responses.filter((r) => r.status === 'fail').length,
    notApplicable: responses.filter((r) => r.status === 'not-applicable').length,
    total: responses.length,
  };
}

/**
 * Check if questionnaire is complete
 */
export function isQuestionnaireComplete(
  selectedPlatforms: Platform[],
  auditResponses: Map<Platform, AuditResult[]>
): boolean {
  return selectedPlatforms.every((platform) => {
    const checks = getPlatformChecks(platform);
    if (checks.length === 0) return true; // Skip platforms with no checks

    const responses = auditResponses.get(platform) || [];
    const coverage = Math.round((responses.length / checks.length) * 100);
    return coverage >= 80; // At least 80% answered
  });
}
