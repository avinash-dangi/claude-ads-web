import {
  AuditResult,
  AuditCheck,
  AuditCategory,
  CheckStatus,
  SEVERITY_WEIGHTS,
  GRADE_THRESHOLDS,
  CategoryScore,
} from '@/types/audit';

/**
 * Calculate the score for a single response/check
 * Formula: responseValue * severityWeight * categoryWeight * 100
 *
 * responseValue mapping:
 * - pass: 1.0 (100%)
 * - warning: 0.5 (50%)
 * - fail: 0.0 (0%)
 * - not-applicable: excluded
 */
export function calculateResponseScore(
  status: CheckStatus,
  severity: keyof typeof SEVERITY_WEIGHTS,
  categoryWeight: number
): number {
  // Map status to response value
  let responseValue = 0;
  if (status === 'pass') {
    responseValue = 1.0;
  } else if (status === 'warning') {
    responseValue = 0.5;
  } else if (status === 'fail') {
    responseValue = 0.0;
  } else if (status === 'not-applicable') {
    return 0; // Excluded from scoring
  }

  const severityWeight = SEVERITY_WEIGHTS[severity];
  return responseValue * severityWeight * categoryWeight * 100;
}

/**
 * Calculate the maximum possible score for a check
 * This is the denominator for calculating percentage scores
 */
export function calculateMaxResponseScore(
  severity: keyof typeof SEVERITY_WEIGHTS,
  categoryWeight: number
): number {
  const severityWeight = SEVERITY_WEIGHTS[severity];
  return severityWeight * categoryWeight * 100;
}

/**
 * Calculate score for a specific category
 * Returns both the score and supporting metrics
 */
export function calculateCategoryScore(
  categoryResults: Array<{
    check: AuditCheck;
    result: AuditResult;
  }>,
  category: AuditCategory
): CategoryScore {
  let totalScore = 0;
  let maxScore = 0;
  let passedChecks = 0;
  let warningChecks = 0;
  let failedChecks = 0;

  for (const { check, result } of categoryResults) {
    if (result.status === 'not-applicable') {
      continue;
    }

    const responseScore = calculateResponseScore(
      result.status,
      check.severity,
      category.weight
    );
    const maxResponseScore = calculateMaxResponseScore(
      check.severity,
      category.weight
    );

    totalScore += responseScore;
    maxScore += maxResponseScore;

    // Count check statuses
    if (result.status === 'pass') {
      passedChecks++;
    } else if (result.status === 'warning') {
      warningChecks++;
    } else if (result.status === 'fail') {
      failedChecks++;
    }
  }

  const score = maxScore > 0 ? totalScore : 0;
  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  return {
    name: category.name,
    weight: category.weight,
    totalChecks: category.checkCount,
    passedChecks,
    warningChecks,
    failedChecks,
    score,
    percentage,
  };
}

/**
 * Calculate overall health score from category scores
 * Weighted average of all category percentages
 */
export function calculatePlatformHealthScore(
  categoryScores: CategoryScore[]
): number {
  if (categoryScores.length === 0) return 0;

  let weightedSum = 0;
  let totalWeight = 0;

  for (const category of categoryScores) {
    // Use percentage (0-100) weighted by category weight
    weightedSum += category.percentage * category.weight;
    totalWeight += category.weight;
  }

  return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
}

/**
 * Convert a health score (0-100) to a letter grade
 */
export function scoreToGrade(score: number): string {
  if (score >= GRADE_THRESHOLDS.A) return 'A';
  if (score >= GRADE_THRESHOLDS.B) return 'B';
  if (score >= GRADE_THRESHOLDS.C) return 'C';
  if (score >= GRADE_THRESHOLDS.D) return 'D';
  return 'F';
}

/**
 * Get the color for a grade (for UI rendering)
 */
export function getGradeColor(grade: string): string {
  switch (grade) {
    case 'A':
      return 'text-green-600';
    case 'B':
      return 'text-blue-600';
    case 'C':
      return 'text-yellow-600';
    case 'D':
      return 'text-orange-600';
    case 'F':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}

/**
 * Get the background color for a grade (for UI rendering)
 */
export function getGradeBgColor(grade: string): string {
  switch (grade) {
    case 'A':
      return 'bg-green-100';
    case 'B':
      return 'bg-blue-100';
    case 'C':
      return 'bg-yellow-100';
    case 'D':
      return 'bg-orange-100';
    case 'F':
      return 'bg-red-100';
    default:
      return 'bg-gray-100';
  }
}

/**
 * Get the color for severity level (for UI rendering)
 */
export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'high':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'low':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

/**
 * Count findings by severity
 */
export function countFindingsBySeverity(
  results: AuditResult[],
  checks: AuditCheck[]
): Record<string, number> {
  const counts = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  for (const result of results) {
    if (result.status === 'fail' || result.status === 'warning') {
      const check = checks.find((c) => c.id === result.checkId);
      if (check && check.severity in counts) {
        counts[check.severity as keyof typeof counts]++;
      }
    }
  }

  return counts;
}
