import {
  AuditResult,
  AuditCheck,
} from '@/types/audit';
import { AuditFormData, Platform } from '@/types/business';

/**
 * Process raw audit responses from the store
 * Map responses to checks and validate data integrity
 */
export function processAuditResponses(
  formData: Partial<AuditFormData>,
  auditResponses: Map<Platform, AuditResult[]>
): Map<Platform, AuditResult[]> {
  const processedResponses = new Map<Platform, AuditResult[]>();

  // Process responses for each selected platform
  for (const platform of formData.selectedPlatforms || []) {
    const responses = auditResponses.get(platform) || [];

    // Validate and normalize responses
    const validatedResponses = validateResponses(responses);
    processedResponses.set(platform, validatedResponses);
  }

  return processedResponses;
}

/**
 * Validate and normalize audit responses
 * Ensures all responses have required fields and valid values
 */
function validateResponses(responses: AuditResult[]): AuditResult[] {
  return responses
    .filter((response) => {
      // Must have checkId
      if (!response.checkId) return false;

      // Must have valid status
      const validStatuses = ['pass', 'warning', 'fail', 'not-applicable'];
      if (!validStatuses.includes(response.status)) return false;

      return true;
    })
    .map((response) => ({
      checkId: response.checkId,
      status: response.status,
      notes: response.notes?.trim() || undefined,
      impact: response.impact || undefined,
    }));
}

/**
 * Map audit responses to checks
 * Creates a paired array of checks with their responses
 */
export function mapResponsesWithChecks(
  responses: AuditResult[],
  checks: AuditCheck[]
): Array<{
  check: AuditCheck;
  response: AuditResult | undefined;
}> {
  const responseMap = new Map(responses.map((r) => [r.checkId, r]));

  return checks.map((check) => ({
    check,
    response: responseMap.get(check.id),
  }));
}

/**
 * Get summary statistics about responses
 */
export function getResponseSummary(responses: AuditResult[], checks: AuditCheck[]): {
  totalChecks: number;
  answered: number;
  notApplicable: number;
  passed: number;
  warned: number;
  failed: number;
  completionPercentage: number;
} {
  const totalChecks = checks.length;
  let answered = 0;
  let notApplicable = 0;
  let passed = 0;
  let warned = 0;
  let failed = 0;

  for (const response of responses) {
    if (response.status === 'not-applicable') {
      notApplicable++;
    } else {
      answered++;
      if (response.status === 'pass') {
        passed++;
      } else if (response.status === 'warning') {
        warned++;
      } else if (response.status === 'fail') {
        failed++;
      }
    }
  }

  const completionPercentage =
    totalChecks > 0
      ? Math.round(((answered + notApplicable) / totalChecks) * 100)
      : 0;

  return {
    totalChecks,
    answered,
    notApplicable,
    passed,
    warned,
    failed,
    completionPercentage,
  };
}

/**
 * Filter responses by status
 */
export function filterResponsesByStatus(
  responses: AuditResult[],
  status: 'pass' | 'warning' | 'fail' | 'not-applicable'
): AuditResult[] {
  return responses.filter((r) => r.status === status);
}

/**
 * Get responses for a specific category
 */
export function getResponsesForCategory(
  responses: AuditResult[],
  checks: AuditCheck[],
  category: string
): AuditResult[] {
  const categoryCheckIds = checks
    .filter((c) => c.category === category)
    .map((c) => c.id);

  return responses.filter((r) => categoryCheckIds.includes(r.checkId));
}

/**
 * Merge multiple response sets (for multi-platform audits)
 */
export function mergeResponses(
  ...responseSets: AuditResult[][]
): AuditResult[] {
  const merged: AuditResult[] = [];
  const seenIds = new Set<string>();

  for (const responses of responseSets) {
    for (const response of responses) {
      if (!seenIds.has(response.checkId)) {
        merged.push(response);
        seenIds.add(response.checkId);
      }
    }
  }

  return merged;
}

/**
 * Export responses as JSON
 */
export function exportResponsesAsJSON(
  responses: AuditResult[],
  platform: string,
  businessName: string
): string {
  const exportData = {
    platform,
    businessName,
    exportDate: new Date().toISOString(),
    responses,
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Export responses as CSV
 */
export function exportResponsesAsCSV(
  responses: AuditResult[],
  checks: AuditCheck[]
): string {
  const checkMap = new Map(checks.map((c) => [c.id, c]));

  // Header
  const csv = ['Check ID', 'Category', 'Check Name', 'Status', 'Notes', 'Impact'];

  // Body
  for (const response of responses) {
    const check = checkMap.get(response.checkId);
    if (check) {
      csv.push(
        [
          response.checkId,
          `"${check.category}"`,
          `"${check.check}"`,
          response.status,
          `"${response.notes || ''}"`,
          `"${response.impact || ''}"`,
        ].join(',')
      );
    }
  }

  return csv.join('\n');
}

/**
 * Validate response data for submission
 */
export function validateResponseSubmission(
  responses: AuditResult[],
  checks: AuditCheck[],
  minCompletion: number = 50
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (responses.length === 0) {
    errors.push('No responses provided');
    return { valid: false, errors };
  }

  const summary = getResponseSummary(responses, checks);

  if (summary.completionPercentage < minCompletion) {
    errors.push(
      `Completion level too low. Minimum ${minCompletion}%, got ${summary.completionPercentage}%`
    );
  }

  if (summary.answered === 0) {
    errors.push('Must have at least some answered checks');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
