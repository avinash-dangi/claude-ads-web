export type Severity = 'critical' | 'high' | 'medium' | 'low';

export type CheckStatus = 'pass' | 'warning' | 'fail' | 'not-applicable';

export interface AuditCheck {
  id: string;
  check: string;
  severity: Severity;
  category: string;
  pass: string;
  warning: string;
  fail: string;
  description?: string;
}

export interface AuditCategory {
  name: string;
  weight: number;
  checkCount: number;
  description?: string;
}

export interface PlatformAudit {
  platform: string;
  totalChecks: number;
  categories: AuditCategory[];
  checks: AuditCheck[];
}

export interface AuditResult {
  checkId: string;
  status: CheckStatus;
  notes?: string;
  impact?: string;
}

export interface AuditReport {
  platform: string;
  date: Date;
  results: AuditResult[];
  score: number;
  grade: string;
  findings: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  recommendations: string[];
  quickWins: string[];
}

export interface MultiPlatformAudit {
  overallScore: number;
  overallGrade: string;
  platformReports: AuditReport[];
  topIssues: Array<{
    platform: string;
    checkId: string;
    issue: string;
    priority: Severity;
  }>;
  actionPlan: Array<{
    priority: number;
    action: string;
    platform: string;
    impact: string;
    effort: 'low' | 'medium' | 'high';
  }>;
}

export interface Finding {
  id: string;
  checkId: string;
  category: string;
  title: string;
  severity: Severity;
  status: CheckStatus;
  currentState: string;
  targetState: string;
  reason: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
  recommendation: string;
  checkDescription?: string;
}

export interface QuickWin {
  id: string;
  title: string;
  description: string;
  estimatedImpact: string;
  effort: 'low' | 'medium';
  category: string;
  checkIds: string[];
}

export interface ActionItem {
  priority: number;
  title: string;
  description: string;
  category: string;
  severity: Severity;
  estimatedEffort: 'low' | 'medium' | 'high';
  expectedImpact: string;
  checklist: string[];
  dependencies?: number[]; // Priority numbers of dependent items
}

export interface CategoryScore {
  name: string;
  weight: number;
  totalChecks: number;
  passedChecks: number;
  warningChecks: number;
  failedChecks: number;
  score: number;
  percentage: number;
}

export const SEVERITY_WEIGHTS = {
  critical: 5.0,
  high: 3.0,
  medium: 1.5,
  low: 0.5,
} as const;

export const GRADE_THRESHOLDS = {
  A: 90,
  B: 75,
  C: 60,
  D: 40,
  F: 0,
} as const;
