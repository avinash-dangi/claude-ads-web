'use client';

import { useAuditStore } from '@/store/audit-store';
import { BUSINESS_TYPES, PLATFORM_INFO, Platform } from '@/types/business';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

export default function ReviewStep() {
  const { formData, getAuditResponses } = useAuditStore();

  const businessType = BUSINESS_TYPES.find((t) => t.value === formData.businessInfo?.type);
  const selectedPlatforms = formData.selectedPlatforms || [];
  const totalChecks = selectedPlatforms.reduce((acc, platform) => {
    const info = PLATFORM_INFO.find((p) => p.value === platform);
    return acc + (info?.checks || 0);
  }, 0);

  const getPlatformStats = (platform: Platform) => {
    const responses = getAuditResponses(platform);
    const stats = {
      total: responses.length,
      pass: responses.filter((r) => r.status === 'pass').length,
      warning: responses.filter((r) => r.status === 'warning').length,
      fail: responses.filter((r) => r.status === 'fail').length,
      notApplicable: responses.filter((r) => r.status === 'not-applicable').length,
    };
    return stats;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Review Your Audit Request</h3>
        <p className="text-slate-600">
          Please review your information before generating the audit report
        </p>
      </div>

      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Business Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between py-2 border-b">
            <span className="text-slate-600">Business Name</span>
            <span className="font-medium">{formData.businessInfo?.name || 'Not provided'}</span>
          </div>

          <div className="flex justify-between py-2 border-b">
            <span className="text-slate-600">Business Type</span>
            <div className="flex items-center gap-2">
              <span className="text-xl">{businessType?.icon}</span>
              <span className="font-medium">{businessType?.label || 'Not selected'}</span>
            </div>
          </div>

          {formData.businessInfo?.website && (
            <div className="flex justify-between py-2 border-b">
              <span className="text-slate-600">Website</span>
              <span className="font-medium text-blue-600 hover:underline">
                <a href={formData.businessInfo.website} target="_blank" rel="noopener noreferrer">
                  {formData.businessInfo.website}
                </a>
              </span>
            </div>
          )}

          {formData.businessInfo?.monthlyBudget && (
            <div className="flex justify-between py-2 border-b">
              <span className="text-slate-600">Monthly Budget</span>
              <span className="font-medium">
                ${formData.businessInfo.monthlyBudget.toLocaleString()}
              </span>
            </div>
          )}

          {formData.businessInfo?.primaryGoal && (
            <div className="flex justify-between py-2">
              <span className="text-slate-600">Primary Goal</span>
              <span className="font-medium">{formData.businessInfo.primaryGoal}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Platforms with Response Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Selected Platforms & Responses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {selectedPlatforms.map((platformValue) => {
              const platform = PLATFORM_INFO.find((p) => p.value === platformValue);
              const stats = getPlatformStats(platformValue as Platform);

              return (
                <div key={platformValue} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{platform?.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium">{platform?.label}</div>
                      <div className="text-xs text-slate-600">{platform?.checks} total checks</div>
                    </div>
                    {stats.total > 0 ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                    )}
                  </div>

                  {stats.total > 0 && (
                    <div className="grid grid-cols-4 gap-2 text-xs mt-3 pt-3 border-t">
                      <div className="text-center">
                        <div className="font-semibold text-green-700">{stats.pass}</div>
                        <div className="text-slate-600">Pass</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-yellow-700">{stats.warning}</div>
                        <div className="text-slate-600">Warning</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-red-700">{stats.fail}</div>
                        <div className="text-slate-600">Fail</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-slate-700">{stats.notApplicable}</div>
                        <div className="text-slate-600">N/A</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total Audit Checks</span>
              <Badge className="bg-blue-600">{totalChecks} checks</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What Happens Next */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            What Happens Next
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">1.</span>
              <span>
                You'll answer guided questions about each selected platform's setup and
                configuration
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">2.</span>
              <span>
                We'll analyze your responses against {totalChecks} best practice checks across all
                categories
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">3.</span>
              <span>
                You'll receive a comprehensive report with your Ads Health Score (0-100), findings
                by severity, and a prioritized action plan
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">4.</span>
              <span>
                Quick wins and optimization opportunities will be highlighted for immediate
                implementation
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-slate-500">
        <p>Ready to generate your report? Click "Generate Report" below.</p>
        <p className="mt-1">This process typically takes 2-3 minutes.</p>
      </div>
    </div>
  );
}
