'use client';

import { useAuditStore } from '@/store/audit-store';
import { PLATFORM_INFO, Platform } from '@/types/business';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';

const ACCESS_METHODS = [
  {
    value: 'manual',
    label: 'Manual Input',
    description: 'I\'ll answer questions about my account',
    recommended: true,
  },
  {
    value: 'screenshots',
    label: 'Screenshots',
    description: 'Upload screenshots of your ad account',
    recommended: false,
  },
  {
    value: 'export',
    label: 'Data Export',
    description: 'Upload CSV/Excel reports from your ad platform',
    recommended: false,
  },
  {
    value: 'api',
    label: 'API Access',
    description: 'Connect via API for automated analysis (coming soon)',
    recommended: false,
    disabled: true,
  },
];

export default function AccountAccessStep() {
  const { formData, setFormData } = useAuditStore();
  const selectedPlatforms = formData.selectedPlatforms || [];

  const handleAccessMethodChange = (platform: Platform, method: string) => {
    setFormData({
      accountAccess: {
        ...formData.accountAccess,
        [platform]: {
          hasAccess: true,
          accessMethod: method as any,
        },
      },
    });
  };

  if (selectedPlatforms.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        Please select at least one platform in the previous step
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p className="font-semibold mb-1">How to provide account data</p>
          <p>
            For the most accurate audit, we recommend selecting "Manual Input" where you'll answer
            guided questions about your account setup. Alternatively, you can upload screenshots or
            export files.
          </p>
        </div>
      </div>

      {selectedPlatforms.map((platformValue) => {
        const platform = PLATFORM_INFO.find((p) => p.value === platformValue);
        if (!platform) return null;

        const currentAccess = formData.accountAccess?.[platformValue];
        const selectedMethod = currentAccess?.accessMethod || 'manual';

        return (
          <Card key={platformValue}>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{platform.icon}</span>
                <div>
                  <CardTitle>{platform.label}</CardTitle>
                  <CardDescription>{platform.checks} checks to audit</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedMethod} onValueChange={(value) => handleAccessMethodChange(platformValue, value)}>
                <div className="space-y-3">
                  {ACCESS_METHODS.map((method) => (
                    <div key={method.value} className="flex items-start space-x-3">
                      <RadioGroupItem
                        value={method.value}
                        id={`${platformValue}-${method.value}`}
                        disabled={method.disabled}
                        className="mt-1"
                      />
                      <Label
                        htmlFor={`${platformValue}-${method.value}`}
                        className={`flex-1 cursor-pointer ${
                          method.disabled ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{method.label}</span>
                          {method.recommended && (
                            <Badge variant="secondary" className="text-xs">
                              Recommended
                            </Badge>
                          )}
                          {method.disabled && (
                            <Badge variant="outline" className="text-xs">
                              Coming Soon
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-600">{method.description}</p>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>

              {selectedMethod === 'manual' && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-800">
                    ✓ You'll be guided through questions about your {platform.label} account setup
                    in the next step.
                  </p>
                </div>
              )}

              {selectedMethod === 'screenshots' && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <p className="text-sm text-amber-800">
                    📸 Please prepare screenshots of: Campaign overview, Conversion tracking, Ad
                    groups, and Performance metrics.
                  </p>
                </div>
              )}

              {selectedMethod === 'export' && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <p className="text-sm text-amber-800">
                    📊 Please export: Campaign performance report, Search terms report (if
                    applicable), and Conversion report.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
