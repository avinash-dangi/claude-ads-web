import { AuditResult, AuditReport } from '@/types/audit';
import { googleAdsAudit } from '@/data/checklists/google-ads';
import { calculatePlatformScore } from '@/lib/scoring/calculate-score';

// Generate mock audit results for demonstration
export function generateMockAuditResults(): AuditResult[] {
  const results: AuditResult[] = [];

  // Simulate realistic audit with mix of pass/warning/fail
  googleAdsAudit.checks.forEach((check, index) => {
    let status: AuditResult['status'];

    // Create realistic distribution
    const rand = Math.random();
    if (check.severity === 'critical') {
      // Critical items more likely to have issues
      status = rand < 0.3 ? 'fail' : rand < 0.6 ? 'warning' : 'pass';
    } else if (check.severity === 'high') {
      status = rand < 0.25 ? 'fail' : rand < 0.5 ? 'warning' : 'pass';
    } else if (check.severity === 'medium') {
      status = rand < 0.15 ? 'fail' : rand < 0.4 ? 'warning' : 'pass';
    } else {
      status = rand < 0.1 ? 'fail' : rand < 0.3 ? 'warning' : 'pass';
    }

    results.push({
      checkId: check.id,
      status,
      notes: status === 'fail'
        ? `Issue detected: ${check.fail}`
        : status === 'warning'
        ? `Attention needed: ${check.warning}`
        : undefined,
      impact: check.severity,
    });
  });

  return results;
}

export function generateMockAuditReport(): AuditReport {
  const mockResults = generateMockAuditResults();
  return calculatePlatformScore(googleAdsAudit, mockResults);
}

// Mock multi-platform report
export function generateMockMultiPlatformReport() {
  const googleReport = generateMockAuditReport();

  return {
    overallScore: googleReport.score,
    overallGrade: googleReport.grade,
    platformReports: [googleReport],
    topIssues: [
      {
        platform: 'Google Ads',
        checkId: 'G42',
        issue: 'No active conversion actions configured',
        priority: 'critical' as const,
      },
      {
        platform: 'Google Ads',
        checkId: 'G16',
        issue: '>15% of spend on irrelevant search terms',
        priority: 'critical' as const,
      },
      {
        platform: 'Google Ads',
        checkId: 'G21',
        issue: '>25% of keywords with Quality Score ≤4',
        priority: 'critical' as const,
      },
      {
        platform: 'Google Ads',
        checkId: 'G07',
        issue: 'No brand exclusions in PMax alongside brand Search',
        priority: 'high' as const,
      },
      {
        platform: 'Google Ads',
        checkId: 'G57',
        issue: 'No Customer Match lists uploaded',
        priority: 'high' as const,
      },
    ],
    actionPlan: [
      {
        priority: 1,
        action: 'Set up conversion tracking with at least one primary conversion action',
        platform: 'Google Ads',
        impact: 'Enables smart bidding and accurate ROI measurement',
        effort: 'medium' as const,
      },
      {
        priority: 2,
        action: 'Add negative keyword lists to reduce wasted spend on irrelevant terms',
        platform: 'Google Ads',
        impact: 'Can reduce wasted spend by 10-20% immediately',
        effort: 'low' as const,
      },
      {
        priority: 3,
        action: 'Configure brand exclusions in Performance Max campaigns',
        platform: 'Google Ads',
        impact: 'Prevents PMax from cannibalizing brand Search campaigns',
        effort: 'low' as const,
      },
      {
        priority: 4,
        action: 'Improve Quality Score for low-performing keywords',
        platform: 'Google Ads',
        impact: 'Lower CPCs and better ad positions',
        effort: 'high' as const,
      },
      {
        priority: 5,
        action: 'Upload Customer Match lists for better audience targeting',
        platform: 'Google Ads',
        impact: 'Enables remarketing and similar audience targeting',
        effort: 'medium' as const,
      },
    ],
  };
}
