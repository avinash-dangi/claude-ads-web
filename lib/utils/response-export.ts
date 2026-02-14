import { Platform } from '@/types/business';
import { AuditResult } from '@/types/audit';

interface ExportData {
  timestamp: string;
  company: string;
  platform: Platform;
  responses: Array<{
    checkId: string;
    status: string;
    notes?: string;
  }>;
}

/**
 * Export responses as JSON file
 */
export function exportResponsesAsJSON(
  platform: Platform,
  companyName: string,
  responses: AuditResult[]
): void {
  const data: ExportData = {
    timestamp: new Date().toISOString(),
    company: companyName,
    platform,
    responses: responses.map((r) => ({
      checkId: r.checkId,
      status: r.status,
      notes: r.notes,
    })),
  };

  const jsonString = JSON.stringify(data, null, 2);
  downloadFile(jsonString, `responses_${platform}_${Date.now()}.json`, 'application/json');
}

/**
 * Export responses as CSV file
 */
export function exportResponsesAsCSV(
  platform: Platform,
  companyName: string,
  responses: AuditResult[]
): void {
  const headers = ['Check ID', 'Status', 'Notes'];
  const rows = responses.map((r) => [r.checkId, r.status, r.notes || '']);

  const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

  downloadFile(csv, `responses_${platform}_${Date.now()}.csv`, 'text/csv');
}

/**
 * Export all platform responses as JSON
 */
export function exportAllResponsesAsJSON(
  companyName: string,
  allResponses: Map<Platform, AuditResult[]>
): void {
  const platforms: Array<{
    platform: Platform;
    responses: Array<{
      checkId: string;
      status: string;
      notes?: string;
    }>;
  }> = Array.from(allResponses.entries()).map(([platform, responses]) => ({
    platform,
    responses: responses.map((r) => ({
      checkId: r.checkId,
      status: r.status,
      notes: r.notes,
    })),
  }));

  const data = {
    timestamp: new Date().toISOString(),
    company: companyName,
    platforms,
  };

  const jsonString = JSON.stringify(data, null, 2);
  downloadFile(jsonString, `all_responses_${Date.now()}.json`, 'application/json');
}

/**
 * Get response summary statistics
 */
export function getResponseSummary(responses: AuditResult[]) {
  return {
    total: responses.length,
    pass: responses.filter((r) => r.status === 'pass').length,
    warning: responses.filter((r) => r.status === 'warning').length,
    fail: responses.filter((r) => r.status === 'fail').length,
    notApplicable: responses.filter((r) => r.status === 'not-applicable').length,
    answered: responses.filter((r) => r.status !== 'not-applicable').length,
  };
}

/**
 * Get completion percentage
 */
export function getCompletionPercentage(responses: AuditResult[], totalChecks: number): number {
  if (totalChecks === 0) return 0;
  const answered = responses.filter((r) => r.status !== 'not-applicable').length;
  return Math.round((answered / totalChecks) * 100);
}

/**
 * Check if response coverage is sufficient (80% threshold)
 */
export function isCoverageSufficient(responses: AuditResult[], totalChecks: number): boolean {
  return getCompletionPercentage(responses, totalChecks) >= 80;
}

/**
 * Estimate time remaining based on response rate
 */
export function estimateTimeRemaining(
  currentIndex: number,
  totalChecks: number,
  timePerQuestion: number = 1 // minutes
): number {
  const questionsRemaining = totalChecks - currentIndex - 1;
  return Math.max(0, questionsRemaining * timePerQuestion);
}

/**
 * Helper function to download file
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Save responses to localStorage for session persistence
 */
export function saveResponsesToSession(
  platform: Platform,
  responses: AuditResult[]
): void {
  try {
    const sessionKey = `audit_responses_${platform}`;
    localStorage.setItem(sessionKey, JSON.stringify(responses));
    localStorage.setItem(`audit_responses_${platform}_timestamp`, new Date().toISOString());
  } catch (error) {
    console.error('Error saving responses to session:', error);
  }
}

/**
 * Load responses from localStorage
 */
export function loadResponsesFromSession(platform: Platform): AuditResult[] | null {
  try {
    const sessionKey = `audit_responses_${platform}`;
    const data = localStorage.getItem(sessionKey);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading responses from session:', error);
    return null;
  }
}

/**
 * Clear responses from session
 */
export function clearResponsesFromSession(platform: Platform): void {
  try {
    localStorage.removeItem(`audit_responses_${platform}`);
    localStorage.removeItem(`audit_responses_${platform}_timestamp`);
  } catch (error) {
    console.error('Error clearing responses from session:', error);
  }
}

/**
 * Get session timestamp for responses
 */
export function getResponsesSessionTimestamp(platform: Platform): string | null {
  try {
    return localStorage.getItem(`audit_responses_${platform}_timestamp`);
  } catch (error) {
    console.error('Error getting session timestamp:', error);
    return null;
  }
}
