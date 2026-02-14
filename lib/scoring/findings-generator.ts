import {
  AuditResult,
  AuditCheck,
  Finding,
  Severity,
} from '@/types/audit';

/**
 * Generate findings from audit responses and checks
 * A finding is created for each check that is not passing
 */
export function generateFindings(
  results: AuditResult[],
  checks: AuditCheck[]
): Finding[] {
  const findings: Finding[] = [];
  const findingIdMap = new Map<string, number>(); // For unique IDs

  for (const result of results) {
    // Skip passing and not-applicable checks
    if (result.status === 'pass' || result.status === 'not-applicable') {
      continue;
    }

    const check = checks.find((c) => c.id === result.checkId);
    if (!check) continue;

    const finding = enrichFindingWithContext(check, result);
    findings.push(finding);

    // Track for unique IDs
    const baseId = `${check.severity}-${check.category}`;
    const count = (findingIdMap.get(baseId) || 0) + 1;
    findingIdMap.set(baseId, count);
  }

  // Sort by severity (critical first) then by category
  findings.sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    const severityDiff =
      severityOrder[a.severity] - severityOrder[b.severity];

    if (severityDiff !== 0) return severityDiff;

    // Secondary sort by category name
    return a.category.localeCompare(b.category);
  });

  return findings;
}

/**
 * Enrich a finding with detailed context information
 * Maps check details and response status to actionable finding
 */
export function enrichFindingWithContext(
  check: AuditCheck,
  result: AuditResult
): Finding {
  // Determine the current and target states
  let currentState = '';
  let targetState = '';
  let reason = '';

  if (result.status === 'fail') {
    currentState = check.fail || 'Issue detected';
    targetState = check.pass || 'Expected state';
    reason = result.notes || check.fail || 'Check not passing';
  } else if (result.status === 'warning') {
    currentState = check.warning || 'Partial compliance';
    targetState = check.pass || 'Expected state';
    reason = result.notes || check.warning || 'Needs attention';
  }

  // Estimate effort based on severity
  const effort = estimateFindingEffort(check);

  // Create recommendation
  const recommendation = createRecommendation(check, result.status);

  // Generate unique ID
  const findingId = `${check.category.toLowerCase().replace(/\s+/g, '-')}-${check.id}`;

  return {
    id: findingId,
    checkId: check.id,
    category: check.category,
    title: check.check,
    severity: check.severity,
    status: result.status,
    currentState,
    targetState,
    reason,
    impact: result.impact || check.severity,
    effort,
    recommendation,
    checkDescription: check.description,
  };
}

/**
 * Estimate the effort required to fix a finding
 * Based on severity and type
 */
function estimateFindingEffort(
  check: AuditCheck
): 'low' | 'medium' | 'high' {
  // Critical issues usually require more effort
  if (check.severity === 'critical') {
    // But some are quick wins (e.g., adding negative keywords)
    if (
      check.category.includes('Negative') ||
      check.check.toLowerCase().includes('negative')
    ) {
      return 'low';
    }
    // Conversion tracking, setup issues are typically medium/high
    if (
      check.category.includes('Conversion') ||
      check.check.toLowerCase().includes('conversion')
    ) {
      return 'high';
    }
    return 'medium';
  }

  // High and medium items
  if (check.severity === 'high') {
    return 'medium';
  }

  // Low severity is usually easier
  if (check.severity === 'medium') {
    return 'medium';
  }

  return 'low';
}

/**
 * Create a specific recommendation based on the check
 */
function createRecommendation(
  check: AuditCheck,
  status: string
): string {
  if (status === 'fail') {
    return (
      check.fail ||
      `This check is failing. Review the pass criteria: ${check.pass}`
    );
  } else {
    return (
      check.warning ||
      `This check is showing a warning. Target: ${check.pass}`
    );
  }
}

/**
 * Group findings by category
 */
export function groupFindingsByCategory(findings: Finding[]): Map<string, Finding[]> {
  const grouped = new Map<string, Finding[]>();

  for (const finding of findings) {
    if (!grouped.has(finding.category)) {
      grouped.set(finding.category, []);
    }
    grouped.get(finding.category)!.push(finding);
  }

  return grouped;
}

/**
 * Group findings by severity
 */
export function groupFindingsBySeverity(findings: Finding[]): Map<Severity, Finding[]> {
  const grouped = new Map<Severity, Finding[]>();

  for (const finding of findings) {
    if (!grouped.has(finding.severity)) {
      grouped.set(finding.severity, []);
    }
    grouped.get(finding.severity)!.push(finding);
  }

  return grouped;
}

/**
 * Count findings by severity level
 */
export function countFindingsBySeverity(findings: Finding[]): Record<Severity, number> {
  const counts: Record<Severity, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  for (const finding of findings) {
    counts[finding.severity]++;
  }

  return counts;
}

/**
 * Get the most critical findings (for top issues section)
 */
export function getTopFindings(findings: Finding[], limit: number = 5): Finding[] {
  // Sort by severity and status (fail > warning)
  const sorted = [...findings].sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    const severityDiff =
      severityOrder[a.severity] - severityOrder[b.severity];

    if (severityDiff !== 0) return severityDiff;

    // Failures before warnings
    if (a.status === 'fail' && b.status === 'warning') return -1;
    if (a.status === 'warning' && b.status === 'fail') return 1;

    return 0;
  });

  return sorted.slice(0, limit);
}
