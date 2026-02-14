import {
  AuditResult,
  AuditReport,
  PlatformAudit,
  MultiPlatformAudit,
  SEVERITY_WEIGHTS,
} from '@/types/audit';
import {
  calculateCategoryScore,
  calculatePlatformHealthScore,
  scoreToGrade,
  getGradeColor,
  getGradeBgColor,
  getSeverityColor,
  countFindingsBySeverity,
} from './scoring-algorithms';

/**
 * Calculate the overall score for a platform audit
 * Uses new algorithm with category-based weighting
 */
export function calculatePlatformScore(
  platformAudit: PlatformAudit,
  results: AuditResult[]
): AuditReport {
  // Calculate scores for each category
  const categoryScores = [];

  for (const category of platformAudit.categories) {
    const categoryResults = [];

    // Collect results for this category
    for (const check of platformAudit.checks) {
      if (check.category === category.name) {
        const result = results.find((r) => r.checkId === check.id);
        if (result) {
          categoryResults.push({ check, result });
        }
      }
    }

    // Calculate category score
    if (categoryResults.length > 0) {
      const score = calculateCategoryScore(categoryResults, category);
      categoryScores.push(score);
    }
  }

  // Calculate overall health score from categories
  const overallScore = calculatePlatformHealthScore(categoryScores);
  const grade = scoreToGrade(overallScore);

  // Count findings by severity
  const findings = countFindingsBySeverity(results, platformAudit.checks);

  // Create recommendations from failed checks
  const recommendations: string[] = [];
  const failedResults = results.filter((r) => r.status === 'fail' || r.status === 'warning');

  for (const result of failedResults) {
    const check = platformAudit.checks.find((c) => c.id === result.checkId);
    if (check) {
      const text =
        result.status === 'fail'
          ? `[${check.severity.toUpperCase()}] ${check.check}: ${check.fail}`
          : `[${check.severity.toUpperCase()}] ${check.check}: ${check.warning}`;
      recommendations.push(text);
    }
  }

  // Sort recommendations by severity
  recommendations.sort((a, b) => {
    const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    const severityA = a.match(/\[(.*?)\]/)?.[1] as keyof typeof severityOrder;
    const severityB = b.match(/\[(.*?)\]/)?.[1] as keyof typeof severityOrder;
    return (severityOrder[severityA] || 999) - (severityOrder[severityB] || 999);
  });

  // Identify quick wins (low-effort, high-impact items)
  const quickWins: string[] = [];
  for (const check of platformAudit.checks) {
    const result = results.find((r) => r.checkId === check.id);
    if (
      result &&
      (result.status === 'fail' || result.status === 'warning') &&
      (check.severity === 'medium' || check.severity === 'low')
    ) {
      quickWins.push(check.check);
    }
  }

  return {
    platform: platformAudit.platform,
    date: new Date(),
    results,
    score: overallScore,
    grade,
    findings: findings as any,
    recommendations: recommendations.slice(0, 10),
    quickWins: quickWins.slice(0, 5),
  };
}

/**
 * Calculate scores for multiple platforms
 * Returns combined report with overall metrics
 */
export function calculateMultiPlatformScore(
  platformAudits: Map<string, PlatformAudit>,
  platformResults: Map<string, AuditResult[]>
): MultiPlatformAudit {
  const platformReports = [];
  let overallScore = 0;
  let platformCount = 0;

  // Calculate report for each platform
  for (const [platform, audit] of platformAudits) {
    const results = platformResults.get(platform) || [];
    const report = calculatePlatformScore(audit, results);
    platformReports.push(report);
    overallScore += report.score;
    platformCount++;
  }

  // Calculate average overall score
  overallScore = platformCount > 0 ? Math.round(overallScore / platformCount) : 0;
  const overallGrade = scoreToGrade(overallScore);

  // Collect top issues across all platforms
  const topIssues = [];
  for (const report of platformReports) {
    for (const result of report.results) {
      if (result.status === 'fail' || result.status === 'warning') {
        const check = report.results
          .map((r) => r.checkId)
          .indexOf(result.checkId);
        if (check >= 0) {
          const severity = result.status === 'fail' ? 'critical' : 'high';
          topIssues.push({
            platform: report.platform,
            checkId: result.checkId,
            issue: `Check: ${result.checkId}`,
            priority: severity as any,
          });
        }
      }
    }
  }

  // Limit to top 5 issues
  topIssues.slice(0, 5);

  // Create action plan
  const actionPlan = [];
  let priority = 1;

  for (const report of platformReports) {
    const failedCount = report.results.filter((r) => r.status === 'fail').length;
    if (failedCount > 0) {
      actionPlan.push({
        priority: priority++,
        action: `Review and address ${failedCount} failed checks on ${report.platform}`,
        platform: report.platform,
        impact: `Improve ${report.platform} health score from ${report.score} to 90+`,
        effort: 'medium' as const,
      });
    }
  }

  return {
    overallScore,
    overallGrade,
    platformReports,
    topIssues,
    actionPlan,
  };
}

// Re-export color functions for convenience
export { getGradeColor, getGradeBgColor, getSeverityColor };
