'use client';

import { Platform } from '@/types/business';
import { AuditResult } from '@/types/audit';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  BarChart3,
  Download,
} from 'lucide-react';
import { getResponseSummary, getCompletionPercentage, exportResponsesAsJSON, exportResponsesAsCSV } from '@/lib/utils/response-export';

interface QuestionnaireSummaryProps {
  platform: Platform;
  totalChecks: number;
  responses: AuditResult[];
  companyName: string;
  onExport?: (format: 'json' | 'csv') => void;
}

export default function QuestionnaireSummary({
  platform,
  totalChecks,
  responses,
  companyName,
  onExport,
}: QuestionnaireSummaryProps) {
  const stats = getResponseSummary(responses);
  const completionPercentage = getCompletionPercentage(responses, totalChecks);
  const platformName = platform
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const handleExport = (format: 'json' | 'csv') => {
    if (onExport) {
      onExport(format);
    } else {
      if (format === 'json') {
        exportResponsesAsJSON(platform, companyName, responses);
      } else {
        exportResponsesAsCSV(platform, companyName, responses);
      }
    }
  };

  return (
    <Card className="bg-gradient-to-br from-slate-50 to-blue-50 border-blue-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              {platformName} Response Summary
            </CardTitle>
            <CardDescription>Real-time audit response collection statistics</CardDescription>
          </div>
          <Badge className="bg-blue-600">{completionPercentage}% Complete</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Completion Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Response Coverage</span>
            <span className="text-sm text-slate-600">
              {stats.answered} of {totalChecks} answered
            </span>
          </div>
          <Progress value={completionPercentage} className="h-3" />
          <p className="text-xs text-slate-600 mt-1">
            {completionPercentage >= 80
              ? '✓ Sufficient data for report generation'
              : `Need ${80 - completionPercentage}% more to proceed`}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
            <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{stats.pass}</div>
            <div className="text-xs text-slate-600">Pass</div>
            <div className="text-xs text-slate-500 mt-1">
              {totalChecks > 0 ? Math.round((stats.pass / totalChecks) * 100) : 0}%
            </div>
          </div>

          <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">{stats.warning}</div>
            <div className="text-xs text-slate-600">Warning</div>
            <div className="text-xs text-slate-500 mt-1">
              {totalChecks > 0 ? Math.round((stats.warning / totalChecks) * 100) : 0}%
            </div>
          </div>

          <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
            <XCircle className="w-5 h-5 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">{stats.fail}</div>
            <div className="text-xs text-slate-600">Fail</div>
            <div className="text-xs text-slate-500 mt-1">
              {totalChecks > 0 ? Math.round((stats.fail / totalChecks) * 100) : 0}%
            </div>
          </div>

          <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
            <HelpCircle className="w-5 h-5 text-slate-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-600">{stats.notApplicable}</div>
            <div className="text-xs text-slate-600">N/A</div>
            <div className="text-xs text-slate-500 mt-1">
              {totalChecks > 0 ? Math.round((stats.notApplicable / totalChecks) * 100) : 0}%
            </div>
          </div>

          <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
            <div className="text-sm font-semibold text-slate-600 mx-auto mb-2">✎</div>
            <div className="text-2xl font-bold text-slate-600">{totalChecks - stats.total}</div>
            <div className="text-xs text-slate-600">Unanswered</div>
            <div className="text-xs text-slate-500 mt-1">
              {totalChecks > 0
                ? Math.round(((totalChecks - stats.total) / totalChecks) * 100)
                : 0}%
            </div>
          </div>
        </div>

        {/* Export Options */}
        {stats.total > 0 && (
          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1">Export Responses</p>
                <p className="text-xs text-slate-600">Download your responses for backup or analysis</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleExport('json')}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  JSON
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleExport('csv')}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  CSV
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Insights */}
        <div className="p-3 bg-blue-100 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900 font-medium mb-1">💡 Tip</p>
          <p className="text-xs text-blue-800">
            You can save your progress and export responses at any time. Responses are automatically saved to your
            browser session.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
