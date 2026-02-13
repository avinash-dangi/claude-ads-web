'use client';

import { useAuditStore } from '@/store/audit-store';
import { BUSINESS_TYPES } from '@/types/business';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription } from '@/components/ui/card';

export default function BusinessInfoStep() {
  const { formData, updateBusinessInfo } = useAuditStore();

  return (
    <div className="space-y-6">
      {/* Business Name */}
      <div className="space-y-2">
        <Label htmlFor="businessName">Business Name *</Label>
        <Input
          id="businessName"
          placeholder="Enter your business name"
          value={formData.businessInfo?.name || ''}
          onChange={(e) => updateBusinessInfo({ name: e.target.value })}
        />
      </div>

      {/* Website */}
      <div className="space-y-2">
        <Label htmlFor="website">Website (Optional)</Label>
        <Input
          id="website"
          type="url"
          placeholder="https://example.com"
          value={formData.businessInfo?.website || ''}
          onChange={(e) => updateBusinessInfo({ website: e.target.value })}
        />
      </div>

      {/* Business Type */}
      <div className="space-y-3">
        <Label>Business Type *</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {BUSINESS_TYPES.map((type) => (
            <Card
              key={type.value}
              className={`cursor-pointer transition-all hover:shadow-md ${
                formData.businessInfo?.type === type.value
                  ? 'ring-2 ring-blue-600 bg-blue-50'
                  : 'hover:border-blue-300'
              }`}
              onClick={() => updateBusinessInfo({ type: type.value })}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{type.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold mb-1">{type.label}</div>
                    <CardDescription className="text-xs">{type.description}</CardDescription>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Monthly Budget */}
      <div className="space-y-2">
        <Label htmlFor="budget">Monthly Ad Budget (Optional)</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
          <Input
            id="budget"
            type="number"
            placeholder="5000"
            className="pl-7"
            value={formData.businessInfo?.monthlyBudget || ''}
            onChange={(e) =>
              updateBusinessInfo({ monthlyBudget: parseFloat(e.target.value) || undefined })
            }
          />
        </div>
        <p className="text-xs text-slate-500">
          Total monthly spend across all platforms (helps us provide better recommendations)
        </p>
      </div>

      {/* Primary Goal */}
      <div className="space-y-2">
        <Label htmlFor="goal">Primary Goal (Optional)</Label>
        <Input
          id="goal"
          placeholder="e.g., Increase conversions, Lower CPA, Improve ROAS"
          value={formData.businessInfo?.primaryGoal || ''}
          onChange={(e) => updateBusinessInfo({ primaryGoal: e.target.value })}
        />
      </div>
    </div>
  );
}
