import { MultiPlatformAudit, AuditReport } from '@/types/audit';
import { AuditFormData } from '@/types/business';

/**
 * Generate PDF report data structure from audit results
 * This converts the audit data into a format suitable for PDF generation
 */
export function generatePDFReportData(
  formData: Partial<AuditFormData>,
  report: MultiPlatformAudit
) {
  const reportDate = new Date();

  return {
    // Company Information
    company: {
      name: formData.businessInfo?.name || 'Company Name',
      type: formData.businessInfo?.type || 'unknown',
      website: formData.businessInfo?.website || '',
      generatedDate: reportDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    },

    // Overall Results
    overall: {
      score: report.overallScore,
      grade: report.overallGrade,
      gradeColor: getGradeColor(report.overallGrade),
      platformCount: report.platformReports.length,
    },

    // Summary Statistics
    summary: {
      totalChecks: report.platformReports.reduce((sum, p) => sum + p.results.length, 0),
      passingChecks: report.platformReports.reduce(
        (sum, p) => sum + p.results.filter((r) => r.status === 'pass').length,
        0
      ),
      warningChecks: report.platformReports.reduce(
        (sum, p) => sum + p.results.filter((r) => r.status === 'warning').length,
        0
      ),
      criticalIssues: report.platformReports.reduce((sum, p) => sum + p.findings.critical, 0),
      totalFindings: report.platformReports.reduce(
        (sum, p) => sum + p.findings.critical + p.findings.high + p.findings.medium + p.findings.low,
        0
      ),
    },

    // Platform Reports
    platforms: report.platformReports.map((p) => ({
      name: formatPlatformName(p.platform),
      score: p.score,
      grade: p.grade,
      gradeColor: getGradeColor(p.grade),
      totalChecks: p.results.length,
      findings: {
        critical: p.findings.critical,
        high: p.findings.high,
        medium: p.findings.medium,
        low: p.findings.low,
      },
      passingPercentage: Math.round(
        (p.results.filter((r) => r.status === 'pass').length / p.results.length) * 100
      ),
      topQuickWins: p.quickWins.slice(0, 3),
      topRecommendations: p.recommendations.slice(0, 5),
    })),

    // Top Issues
    topIssues: report.topIssues.slice(0, 10),

    // Action Plan (top 10)
    actionPlan: report.actionPlan.slice(0, 10).map((item, index) => ({
      ...item,
      priority: index + 1,
    })),

    // Quick Wins (aggregated across platforms)
    quickWins: extractTopQuickWins(report),
  };
}

/**
 * Extract top quick wins across all platforms
 */
function extractTopQuickWins(report: MultiPlatformAudit) {
  const allQuickWins: Array<{ platform: string; win: string }> = [];

  for (const platform of report.platformReports) {
    platform.quickWins.forEach((win) => {
      allQuickWins.push({
        platform: formatPlatformName(platform.platform),
        win,
      });
    });
  }

  return allQuickWins.slice(0, 5);
}

/**
 * Format platform name for display
 */
function formatPlatformName(platform: string): string {
  const names: Record<string, string> = {
    'google-ads': 'Google Ads',
    'meta-ads': 'Meta Ads',
    'linkedin-ads': 'LinkedIn Ads',
    'tiktok-ads': 'TikTok Ads',
    'microsoft-ads': 'Microsoft Ads',
  };
  return names[platform] || platform;
}

/**
 * Get color code for grade
 */
function getGradeColor(grade: string): string {
  const colors: Record<string, string> = {
    A: '#16a34a', // Green
    B: '#3b82f6', // Blue
    C: '#eab308', // Yellow
    D: '#f97316', // Orange
    F: '#ef4444', // Red
  };
  return colors[grade] || '#6b7280'; // Gray default
}

/**
 * Get severity color
 */
export function getSeverityColor(severity: string): string {
  const colors: Record<string, string> = {
    critical: '#ef4444', // Red
    high: '#f97316', // Orange
    medium: '#eab308', // Yellow
    low: '#3b82f6', // Blue
  };
  return colors[severity] || '#6b7280'; // Gray default
}

/**
 * Format number as percentage
 */
export function formatPercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Generate filename for PDF download
 */
export function generatePDFFilename(companyName: string): string {
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const sanitizedName = companyName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  return `audit_report_${sanitizedName}_${date}.pdf`;
}

/**
 * Export PDF data for server-side rendering
 * This type can be sent to an API endpoint if needed
 */
export function serializePDFData(data: any): string {
  return JSON.stringify(data);
}

/**
 * Parse serialized PDF data
 */
export function deserializePDFData(data: string): any {
  return JSON.parse(data);
}
