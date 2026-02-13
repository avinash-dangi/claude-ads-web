import {
  AuditResult,
  AuditReport,
  PlatformAudit,
  CheckStatus,
  SEVERITY_WEIGHTS,
  GRADE_THRESHOLDS,
} from '@/types/audit';

export function calculatePlatformScore(
  platformAudit: PlatformAudit,
  results: AuditResult[]
): AuditReport {
  let totalScore = 0;
  let maxScore = 0;
  const findings = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };
  const recommendations: string[] = [];
  const quickWins: string[] = [];

  // Calculate weighted scores
  for (const result of results) {
    const check = platformAudit.checks.find((c) => c.id === result.checkId);
    if (!check || result.status === 'not-applicable') continue;

    const severityWeight = SEVERITY_WEIGHTS[check.severity];
    const category = platformAudit.categories.find((cat) => cat.name === check.category);
    const categoryWeight = category?.weight || 0;

    maxScore += severityWeight * categoryWeight * 100;

    // Score based on status
    let checkScore = 0;
    if (result.status === 'pass') {
      checkScore = severityWeight * categoryWeight * 100;
    } else if (result.status === 'warning') {
      checkScore = severityWeight * categoryWeight * 50; // 50% credit for warnings
    } else if (result.status === 'fail') {
      checkScore = 0;
      findings[check.severity]++;

      // Add to recommendations
      recommendations.push(`[${check.severity.toUpperCase()}] ${check.check}: ${check.fail}`);

      // Quick wins are medium/low severity items
      if (check.severity === 'medium' || check.severity === 'low') {
        quickWins.push(check.check);
      }
    }

    totalScore += checkScore;
  }

  // Normalize to 0-100 scale
  const score = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  const grade = getGrade(score);

  // Sort recommendations by severity
  recommendations.sort((a, b) => {
    const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    const severityA = a.match(/\[(.*?)\]/)?.[1] as keyof typeof severityOrder;
    const severityB = b.match(/\[(.*?)\]/)?.[1] as keyof typeof severityOrder;
    return (severityOrder[severityA] || 999) - (severityOrder[severityB] || 999);
  });

  return {
    platform: platformAudit.platform,
    date: new Date(),
    results,
    score,
    grade,
    findings,
    recommendations: recommendations.slice(0, 10), // Top 10
    quickWins: quickWins.slice(0, 5), // Top 5 quick wins
  };
}

export function getGrade(score: number): string {
  if (score >= GRADE_THRESHOLDS.A) return 'A';
  if (score >= GRADE_THRESHOLDS.B) return 'B';
  if (score >= GRADE_THRESHOLDS.C) return 'C';
  if (score >= GRADE_THRESHOLDS.D) return 'D';
  return 'F';
}

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
