'use client';

import { Platform } from '@/types/business';
import { AuditCheck } from '@/types/audit';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';

interface QuestionnaireHeaderProps {
  platform: Platform;
  currentCheckIndex: number;
  totalChecks: number;
  responses: Map<string, { status: string; notes: string }>;
  estimatedTimeRemaining: number;
}

export default function QuestionnaireHeader({
  platform,
  currentCheckIndex,
  totalChecks,
  responses,
  estimatedTimeRemaining,
}: QuestionnaireHeaderProps) {
  const stats = {
    pass: Array.from(responses.values()).filter((r) => r.status === 'pass').length,
    warning: Array.from(responses.values()).filter((r) => r.status === 'warning').length,
    fail: Array.from(responses.values()).filter((r) => r.status === 'fail').length,
    notApplicable: Array.from(responses.values()).filter((r) => r.status === 'not-applicable').length,
    unanswered: totalChecks - responses.size,
  };

  const progress = ((currentCheckIndex + 1) / totalChecks) * 100;
  const platformName = platform
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return (
    <Card className="mb-6 bg-gradient-to-r from-slate-50 to-blue-50 border-blue-200">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{platformName} Audit</h3>
              <p className="text-sm text-slate-600">
                Question {currentCheckIndex + 1} of {totalChecks}
              </p>
            </div>
            {estimatedTimeRemaining > 0 && (
              <div className="text-right">
                <div className="text-sm font-medium text-slate-600">Est. Time</div>
                <div className="text-lg font-semibold">
                  {Math.ceil(estimatedTimeRemaining)} min
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div>
            <Progress value={progress} className="h-2" />
            <div className="text-xs text-slate-600 mt-1">
              {Math.round(progress)}% Complete
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <div>
                <div className="font-semibold">{stats.pass}</div>
                <div className="text-xs text-slate-600">Pass</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <div>
                <div className="font-semibold">{stats.warning}</div>
                <div className="text-xs text-slate-600">Warning</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <XCircle className="w-4 h-4 text-red-600" />
              <div>
                <div className="font-semibold">{stats.fail}</div>
                <div className="text-xs text-slate-600">Fail</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <HelpCircle className="w-4 h-4 text-slate-600" />
              <div>
                <div className="font-semibold">{stats.notApplicable}</div>
                <div className="text-xs text-slate-600">N/A</div>
              </div>
            </div>

            {stats.unanswered > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline">{stats.unanswered}</Badge>
                <div className="text-xs text-slate-600">Unanswered</div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
