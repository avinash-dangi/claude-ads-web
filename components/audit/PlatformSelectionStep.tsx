'use client';

import { useAuditStore } from '@/store/audit-store';
import { PLATFORM_INFO } from '@/types/business';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle } from 'lucide-react';

export default function PlatformSelectionStep() {
  const { formData, togglePlatform } = useAuditStore();
  const selectedPlatforms = formData.selectedPlatforms || [];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-slate-600">
          Select the advertising platforms you want to audit. You can select multiple platforms.
        </p>
        {selectedPlatforms.length > 0 && (
          <p className="text-sm text-blue-600 mt-2">
            {selectedPlatforms.length} platform{selectedPlatforms.length > 1 ? 's' : ''} selected •{' '}
            {selectedPlatforms.reduce((acc, platform) => {
              const info = PLATFORM_INFO.find((p) => p.value === platform);
              return acc + (info?.checks || 0);
            }, 0)}{' '}
            total checks
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {PLATFORM_INFO.map((platform) => {
          const isSelected = selectedPlatforms.includes(platform.value);

          return (
            <Card
              key={platform.value}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                isSelected
                  ? 'ring-2 ring-blue-600 bg-blue-50'
                  : 'hover:border-blue-300'
              }`}
              onClick={() => togglePlatform(platform.value)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div
                      className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl ${
                        isSelected ? 'bg-white' : 'bg-slate-100'
                      }`}
                    >
                      {platform.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{platform.label}</h3>
                      <Badge variant="secondary">{platform.checks} checks</Badge>
                    </div>
                    <CardDescription className="mb-3">{platform.description}</CardDescription>

                    {/* Categories preview */}
                    <div className="flex flex-wrap gap-2">
                      {platform.value === 'google-ads' && (
                        <>
                          <Badge variant="outline" className="text-xs">
                            Conversion Tracking
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Quality Score
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Performance Max
                          </Badge>
                        </>
                      )}
                      {platform.value === 'meta-ads' && (
                        <>
                          <Badge variant="outline" className="text-xs">
                            Pixel & CAPI
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Creative Quality
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Audience Targeting
                          </Badge>
                        </>
                      )}
                      {platform.value === 'linkedin-ads' && (
                        <>
                          <Badge variant="outline" className="text-xs">
                            B2B Targeting
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Lead Gen Forms
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            ABM Strategy
                          </Badge>
                        </>
                      )}
                      {platform.value === 'tiktok-ads' && (
                        <>
                          <Badge variant="outline" className="text-xs">
                            Creative Strategy
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Smart+ Campaigns
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            TikTok Shop
                          </Badge>
                        </>
                      )}
                      {platform.value === 'microsoft-ads' && (
                        <>
                          <Badge variant="outline" className="text-xs">
                            Import Validation
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Copilot Integration
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            MSAN
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  <div className="flex-shrink-0">
                    {isSelected ? (
                      <CheckCircle2 className="w-6 h-6 text-blue-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedPlatforms.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          Select at least one platform to continue
        </div>
      )}
    </div>
  );
}
