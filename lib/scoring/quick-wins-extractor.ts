import {
  Finding,
  QuickWin,
  AuditCheck,
  AuditResult,
} from '@/types/audit';

/**
 * Extract quick wins from findings
 * Quick wins are issues that can be fixed with low effort but provide good value
 */
export function extractQuickWins(
  findings: Finding[],
  checks: AuditCheck[]
): QuickWin[] {
  const quickWins: QuickWin[] = [];
  const processedCheckIds = new Set<string>();

  // Filter for potential quick wins:
  // 1. Low or medium effort
  // 2. Not critical (can be critical if low effort)
  // 3. Has clear actionable path
  for (const finding of findings) {
    // Skip if already processed
    if (processedCheckIds.has(finding.checkId)) {
      continue;
    }

    // Include if it's low effort regardless of severity
    // Or if it's high/medium severity with low effort
    if (finding.effort === 'low' ||
        (finding.effort === 'medium' &&
         (finding.severity === 'high' || finding.severity === 'medium'))) {

      const quickWin = createQuickWin(finding, checks);
      if (quickWin) {
        quickWins.push(quickWin);
        processedCheckIds.add(finding.checkId);
      }
    }
  }

  // Sort by potential impact and effort
  quickWins.sort((a, b) => {
    // Prioritize by effort (low first)
    if (a.effort !== b.effort) {
      return a.effort === 'low' ? -1 : 1;
    }
    // Then by impact
    return 0;
  });

  // Return top 5 quick wins
  return quickWins.slice(0, 5);
}

/**
 * Create a quick win item from a finding
 */
function createQuickWin(
  finding: Finding,
  checks: AuditCheck[]
): QuickWin | null {
  // Validate the finding is actionable
  if (!finding.recommendation || finding.effort === 'high') {
    return null;
  }

  const check = checks.find((c) => c.id === finding.checkId);
  if (!check) return null;

  // Generate impact statement
  const impactStatement = generateImpactStatement(finding, check);

  // Create unique ID
  const quickWinId = `qw-${finding.checkId.toLowerCase()}`;

  return {
    id: quickWinId,
    title: finding.title,
    description: finding.reason,
    estimatedImpact: impactStatement,
    effort: finding.effort as 'low' | 'medium',
    category: finding.category,
    checkIds: [finding.checkId],
  };
}

/**
 * Estimate the effort required to fix an issue
 * Based on the check characteristics and category
 */
export function estimateEffort(check: AuditCheck): 'low' | 'medium' | 'high' {
  // Quick wins based on category patterns
  const checkLower = check.check.toLowerCase();
  const categoryLower = check.category.toLowerCase();

  // Very low effort items
  if (
    checkLower.includes('negative keyword') ||
    checkLower.includes('add exclusion') ||
    checkLower.includes('review and update')
  ) {
    return 'low';
  }

  // Check category patterns
  if (categoryLower.includes('setting') || categoryLower.includes('configuration')) {
    if (check.severity === 'low' || check.severity === 'medium') {
      return 'low';
    }
    return 'medium';
  }

  if (categoryLower.includes('negative')) {
    return 'low';
  }

  // Conversion tracking and setup items are harder
  if (categoryLower.includes('conversion') || categoryLower.includes('tracking')) {
    return check.severity === 'critical' ? 'high' : 'medium';
  }

  // Account structure changes
  if (categoryLower.includes('structure')) {
    return 'medium';
  }

  // Default based on severity
  if (check.severity === 'critical') {
    return 'high';
  }
  if (check.severity === 'high') {
    return 'medium';
  }
  if (check.severity === 'medium') {
    return 'medium';
  }
  return 'low';
}

/**
 * Generate a specific impact statement for a quick win
 */
function generateImpactStatement(finding: Finding, check: AuditCheck): string {
  const severityImpact: Record<string, string> = {
    critical: 'Resolving this will eliminate a critical blocking issue',
    high: 'Resolving this will eliminate a major issue affecting performance',
    medium: 'Resolving this will improve account health and performance',
    low: 'Resolving this will optimize account settings',
  };

  // Specific impact based on category
  if (finding.category.includes('Negative')) {
    return 'Reduce wasted spend by eliminating irrelevant search terms';
  }
  if (finding.category.includes('Conversion')) {
    return 'Enable proper conversion tracking and smart bidding';
  }
  if (finding.category.includes('Quality Score')) {
    return 'Improve keyword quality scores and lower costs';
  }
  if (finding.category.includes('Audience')) {
    return 'Improve targeting accuracy and conversion rates';
  }

  return severityImpact[finding.severity] || 'Improve account performance';
}

/**
 * Get quick win suggestions for a specific category
 */
export function getQuickWinsForCategory(
  findings: Finding[],
  category: string,
  checks: AuditCheck[]
): QuickWin[] {
  const categoryFindings = findings.filter((f) => f.category === category);
  return extractQuickWins(categoryFindings, checks);
}

/**
 * Categorize quick wins by type
 */
export function categorizeQuickWins(quickWins: QuickWin[]): Map<string, QuickWin[]> {
  const categorized = new Map<string, QuickWin[]>();

  for (const win of quickWins) {
    if (!categorized.has(win.category)) {
      categorized.set(win.category, []);
    }
    categorized.get(win.category)!.push(win);
  }

  return categorized;
}

/**
 * Estimate total time to complete all quick wins
 * Returns estimate in minutes
 */
export function estimateCompletionTime(quickWins: QuickWin[]): number {
  const timeMap: Record<string, number> = {
    low: 15,      // 15 minutes per low-effort item
    medium: 45,   // 45 minutes per medium-effort item
  };

  let total = 0;
  for (const win of quickWins) {
    total += timeMap[win.effort] || 15;
  }

  return total;
}
