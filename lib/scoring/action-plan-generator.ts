import {
  Finding,
  ActionItem,
  Severity,
} from '@/types/audit';

/**
 * Generate an action plan from findings
 * Action plan prioritizes items based on severity, impact, and effort
 */
export function generateActionPlan(
  findings: Finding[],
  platform: string,
  businessType?: string
): ActionItem[] {
  const actionItems: ActionItem[] = [];
  let priority = 1;

  // Separate findings by severity
  const findingsBySeverity = groupFindingsBySeverity(findings);

  // Process in order of severity: critical -> high -> medium -> low
  const severityOrder: Severity[] = ['critical', 'high', 'medium', 'low'];

  for (const severity of severityOrder) {
    const severityFindings = findingsBySeverity.get(severity) || [];

    // Within each severity, sort by effort (low first) then category
    const sortedFindings = [...severityFindings].sort((a, b) => {
      const effortOrder = { low: 0, medium: 1, high: 2 };
      const effortDiff = effortOrder[a.effort] - effortOrder[b.effort];

      if (effortDiff !== 0) return effortDiff;

      return a.category.localeCompare(b.category);
    });

    // Create action items
    for (const finding of sortedFindings) {
      const actionItem = createActionItem(finding, priority, platform, businessType);
      if (actionItem) {
        actionItems.push(actionItem);
        priority++;
      }
    }
  }

  // Cap at top 15 action items
  return actionItems.slice(0, 15);
}

/**
 * Create an action item from a finding
 */
function createActionItem(
  finding: Finding,
  priority: number,
  platform: string,
  businessType?: string
): ActionItem | null {
  // Create actionable checklist
  const checklist = createActionChecklist(finding, platform);

  // Create title and description
  const { title, description } = createActionDescription(finding, platform, businessType);

  return {
    priority,
    title,
    description,
    category: finding.category,
    severity: finding.severity,
    estimatedEffort: finding.effort,
    expectedImpact: generateExpectedImpact(finding),
    checklist,
  };
}

/**
 * Group findings by severity
 */
function groupFindingsBySeverity(findings: Finding[]): Map<Severity, Finding[]> {
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
 * Create an actionable checklist for fixing an issue
 */
function createActionChecklist(finding: Finding, platform: string): string[] {
  const checklist: string[] = [];

  // Add generic first step
  checklist.push('Review current state: ' + finding.currentState);

  // Category-specific steps
  if (finding.category.includes('Conversion') && platform === 'Google Ads') {
    checklist.push('Access Google Ads account settings');
    checklist.push('Navigate to Tools > Conversions');
    checklist.push('Create or verify conversion action');
    checklist.push('Implement conversion tracking code');
    checklist.push('Test and verify conversion tracking');
  } else if (finding.category.includes('Negative')) {
    checklist.push('Create negative keyword list');
    checklist.push('Add relevant negative keywords');
    checklist.push('Apply to campaigns or ad groups');
    checklist.push('Monitor for search term reports');
  } else if (finding.category.includes('Audience')) {
    checklist.push('Review current audience settings');
    checklist.push('Identify correct audience segments');
    checklist.push('Create audience lists if needed');
    checklist.push('Apply to campaigns');
  } else if (finding.category.includes('Quality') || finding.category.includes('Keywords')) {
    checklist.push('Pull quality score report');
    checklist.push('Identify underperforming keywords');
    checklist.push('Pause or remove low-quality keywords');
    checklist.push('Create new higher-quality keyword groups');
  } else if (finding.category.includes('Account Structure')) {
    checklist.push('Audit current structure');
    checklist.push('Identify restructuring needs');
    checklist.push('Create new campaigns/ad groups');
    checklist.push('Migrate keywords and ads');
  } else {
    // Generic checklist
    checklist.push('Access account settings');
    checklist.push('Make necessary changes');
    checklist.push('Test and verify');
    checklist.push('Monitor results');
  }

  return checklist;
}

/**
 * Create human-readable title and description for an action item
 */
function createActionDescription(
  finding: Finding,
  platform: string,
  businessType?: string
): { title: string; description: string } {
  // Start with the finding title
  let title = finding.title;

  // Enhance with context
  if (finding.severity === 'critical') {
    title = '🚨 ' + title;
  }

  const description =
    finding.recommendation ||
    `${finding.currentState} → Target: ${finding.targetState}`;

  return { title, description };
}

/**
 * Generate expected impact for an action
 */
function generateExpectedImpact(finding: Finding): string {
  const impactMap: Record<string, Record<string, string>> = {
    critical: {
      'Conversion Tracking': 'Enable smart bidding and accurate ROI measurement',
      'Negative Keywords': 'Reduce wasted spend by 10-20% immediately',
      'Account Structure': 'Improve campaign performance by 15-25%',
      'Quality Score': 'Reduce CPC by 10-15% on average',
      'Creative Diversity': 'Increase CTR and reduce ad fatigue',
    },
    high: {
      'Settings & Targeting': 'Improve account efficiency and relevance',
      'Audience & Targeting': 'Increase conversion rates by targeting better',
      'Account Structure': 'Optimize budget allocation',
    },
    medium: {
      default: 'Improve account health and performance metrics',
    },
    low: {
      default: 'Minor optimization to account settings',
    },
  };

  // Look for category-specific impact
  const severityMap = impactMap[finding.severity];
  if (severityMap) {
    for (const [key, impact] of Object.entries(severityMap)) {
      if (finding.category.includes(key)) {
        return impact;
      }
    }

    // Check for exact match
    return severityMap[finding.category] || severityMap['default'] || generateGenericImpact(finding.severity);
  }

  return generateGenericImpact(finding.severity);
}

/**
 * Generate generic impact statement by severity
 */
function generateGenericImpact(severity: Severity): string {
  switch (severity) {
    case 'critical':
      return 'Eliminate critical blocking issue and enable core functionality';
    case 'high':
      return 'Resolve major issue affecting account performance';
    case 'medium':
      return 'Improve account health and optimization opportunities';
    case 'low':
      return 'Minor optimization to enhance account efficiency';
    default:
      return 'Improve overall account performance';
  }
}

/**
 * Identify dependencies between action items
 * Some items need to be done before others
 */
export function identifyDependencies(actionItems: ActionItem[]): Map<number, number[]> {
  const dependencies = new Map<number, number[]>();

  // Conversion tracking usually comes first
  const conversionIndex = actionItems.findIndex((item) =>
    item.title.toLowerCase().includes('conversion')
  );

  // Account structure should be early
  const structureIndex = actionItems.findIndex((item) =>
    item.title.toLowerCase().includes('structure')
  );

  // If we have conversion tracking, many items depend on it
  if (conversionIndex >= 0) {
    for (let i = 0; i < actionItems.length; i++) {
      if (i !== conversionIndex &&
          actionItems[i].category.includes('Tracking')) {
        if (!dependencies.has(i)) {
          dependencies.set(i, []);
        }
        dependencies.get(i)!.push(actionItems[conversionIndex].priority);
      }
    }
  }

  return dependencies;
}

/**
 * Estimate total implementation time for action plan
 * Returns time in hours
 */
export function estimateImplementationTime(actionItems: ActionItem[]): number {
  const timeMap: Record<string, number> = {
    low: 0.5,    // 30 minutes
    medium: 2,   // 2 hours
    high: 4,     // 4 hours
  };

  let total = 0;
  for (const item of actionItems) {
    total += timeMap[item.estimatedEffort] || 1;
  }

  return total;
}

/**
 * Get high-impact items for focused recommendations
 */
export function getHighImpactItems(
  actionItems: ActionItem[],
  limit: number = 5
): ActionItem[] {
  // Sort by severity then effort
  const severityScore = { critical: 0, high: 1, medium: 2, low: 3 };
  const effortScore = { low: 0, medium: 1, high: 2 };

  return [...actionItems]
    .sort((a, b) => {
      const severityDiff = severityScore[a.severity] - severityScore[b.severity];
      if (severityDiff !== 0) return severityDiff;
      return effortScore[a.estimatedEffort] - effortScore[b.estimatedEffort];
    })
    .slice(0, limit);
}
