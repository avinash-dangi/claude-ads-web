import { AuditReport } from '@/types/audit';
import { googleAdsAudit } from '@/data/checklists/google-ads';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getSeverityColor } from '@/lib/scoring/calculate-score';
import { AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';

interface FindingsListProps {
  report: AuditReport;
}

export default function FindingsList({ report }: FindingsListProps) {
  const failedChecks = report.results.filter((r) => r.status === 'fail');
  const warningChecks = report.results.filter((r) => r.status === 'warning');

  const getCheckDetails = (checkId: string) => {
    return googleAdsAudit.checks.find((c) => c.id === checkId);
  };

  return (
    <div className="space-y-6">
      {/* Failed Checks */}
      {failedChecks.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <CardTitle>Failed Checks ({failedChecks.length})</CardTitle>
            </div>
            <CardDescription>These items require immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {failedChecks.map((result) => {
                const check = getCheckDetails(result.checkId);
                if (!check) return null;

                return (
                  <div
                    key={result.checkId}
                    className={`p-4 rounded-lg border ${getSeverityColor(check.severity)}`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="font-mono text-xs">
                            {check.id}
                          </Badge>
                          <Badge className={getSeverityColor(check.severity)}>
                            {check.severity}
                          </Badge>
                        </div>
                        <h4 className="font-semibold mb-1">{check.check}</h4>
                        <p className="text-sm text-slate-600 mb-2">
                          <span className="font-medium">Category:</span> {check.category}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded p-3 space-y-2">
                      <div>
                        <span className="text-xs font-semibold text-red-600">❌ Current State:</span>
                        <p className="text-sm mt-1">{check.fail}</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-green-600">✅ Target State:</span>
                        <p className="text-sm mt-1">{check.pass}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Warning Checks */}
      {warningChecks.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <CardTitle>Warnings ({warningChecks.length})</CardTitle>
            </div>
            <CardDescription>Areas that need improvement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {warningChecks.map((result) => {
                const check = getCheckDetails(result.checkId);
                if (!check) return null;

                return (
                  <div
                    key={result.checkId}
                    className="p-4 rounded-lg border border-yellow-200 bg-yellow-50"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="font-mono text-xs">
                            {check.id}
                          </Badge>
                          <Badge className={getSeverityColor(check.severity)}>
                            {check.severity}
                          </Badge>
                        </div>
                        <h4 className="font-semibold mb-1">{check.check}</h4>
                        <p className="text-sm text-slate-600">
                          <span className="font-medium">Category:</span> {check.category}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded p-3 space-y-2">
                      <div>
                        <span className="text-xs font-semibold text-yellow-700">⚠️ Current State:</span>
                        <p className="text-sm mt-1">{check.warning}</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-green-600">✅ Target State:</span>
                        <p className="text-sm mt-1">{check.pass}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-blue-600" />
            <div>
              <p className="font-semibold text-blue-900">
                {report.results.filter((r) => r.status === 'pass').length} checks passed
              </p>
              <p className="text-sm text-blue-700">
                These areas are configured according to best practices
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
