'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BUSINESS_TYPES } from '@/types/business';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Target, TrendingUp, DollarSign, Users, Zap } from 'lucide-react';

export default function PlanPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const getStrategyTemplate = (type: string) => {
    const templates: Record<string, any> = {
      saas: {
        platforms: ['Google Ads', 'LinkedIn Ads'],
        primaryGoal: 'Trial signups and demo requests',
        budget: {
          googleAds: 60,
          linkedIn: 30,
          retargeting: 10,
        },
        campaigns: [
          'Brand Search (high intent)',
          'Non-brand Search (problem-aware)',
          'LinkedIn Sponsored Content (job title targeting)',
          'Retargeting (trial dropouts)',
        ],
        kpis: [
          { metric: 'Cost per Trial', target: '$50-150' },
          { metric: 'Trial to Paid %', target: '10-20%' },
          { metric: 'CAC Payback', target: '<6 months' },
        ],
        targeting: 'Job titles, company size, tech stack signals',
        creative: 'Problem/solution messaging, product screenshots, customer testimonials',
      },
      ecommerce: {
        platforms: ['Google Ads', 'Meta Ads'],
        primaryGoal: 'Purchases with target ROAS',
        budget: {
          pmax: 40,
          shopping: 30,
          meta: 20,
          retargeting: 10,
        },
        campaigns: [
          'Performance Max (product feed)',
          'Shopping Campaigns (brand protection)',
          'Meta Advantage+ Shopping',
          'Dynamic Product Ads (retargeting)',
        ],
        kpis: [
          { metric: 'ROAS', target: '3.0-5.0x' },
          { metric: 'AOV', target: 'Track by channel' },
          { metric: 'New vs Returning', target: '70/30 split' },
        ],
        targeting: 'In-market audiences, product page visitors, abandoned cart',
        creative: 'Product imagery, lifestyle shots, UGC reviews, seasonal promos',
      },
      'local-service': {
        platforms: ['Google Ads'],
        primaryGoal: 'Phone calls and form submissions',
        budget: {
          localSearch: 70,
          lsa: 20,
          display: 10,
        },
        campaigns: [
          'Local Services Ads (Google Guaranteed)',
          'Search Campaigns (geo + service keywords)',
          'Call-only ads',
          'Display remarketing (service area)',
        ],
        kpis: [
          { metric: 'Cost per Lead', target: '$20-80' },
          { metric: 'Call Conversion Rate', target: '>40%' },
          { metric: 'Booking Rate', target: '>25%' },
        ],
        targeting: 'Radius targeting, service area zips, mobile bias',
        creative: 'Trust signals, reviews, before/after, emergency CTA',
      },
      'b2b-enterprise': {
        platforms: ['LinkedIn Ads', 'Google Ads'],
        primaryGoal: 'MQLs and sales pipeline',
        budget: {
          linkedIn: 60,
          googleSearch: 30,
          display: 10,
        },
        campaigns: [
          'LinkedIn Sponsored Content (seniority targeting)',
          'LinkedIn Lead Gen Forms',
          'Thought Leader Ads (executive visibility)',
          'Google Search (solution-aware)',
        ],
        kpis: [
          { metric: 'Cost per MQL', target: '$100-300' },
          { metric: 'MQL to SQL %', target: '30-50%' },
          { metric: 'Sales Cycle', target: '3-12 months' },
        ],
        targeting: 'Job function, seniority, company revenue, ABM lists',
        creative: 'Whitepapers, case studies, webinars, ROI calculators',
      },
    };

    return templates[type] || null;
  };

  const strategy = selectedType ? getStrategyTemplate(selectedType) : null;
  const businessType = BUSINESS_TYPES.find((t) => t.value === selectedType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Ad Strategy Planner</h1>
          <p className="text-slate-600">
            Get industry-specific recommendations for your advertising strategy
          </p>
        </div>

        {!selectedType ? (
          <div>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Select Your Business Type</CardTitle>
                <CardDescription>
                  Choose the category that best describes your business to get tailored recommendations
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {BUSINESS_TYPES.filter((t) => ['saas', 'ecommerce', 'local-service', 'b2b-enterprise'].includes(t.value)).map(
                (type) => (
                  <Card
                    key={type.value}
                    className="cursor-pointer hover:shadow-lg transition-all hover:border-blue-400"
                    onClick={() => setSelectedType(type.value)}
                  >
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="text-5xl mb-4">{type.icon}</div>
                        <h3 className="font-semibold text-lg mb-2">{type.label}</h3>
                        <p className="text-sm text-slate-600">{type.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{businessType?.icon}</div>
                    <div>
                      <h2 className="text-2xl font-bold">{businessType?.label} Strategy</h2>
                      <p className="text-blue-100">{strategy?.primaryGoal}</p>
                    </div>
                  </div>
                  <Button variant="secondary" onClick={() => setSelectedType(null)}>
                    Change Type
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Platforms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Recommended Platforms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 mb-6">
                  {strategy?.platforms.map((platform: string) => (
                    <Badge key={platform} className="bg-blue-600 text-base px-4 py-2">
                      {platform}
                    </Badge>
                  ))}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(strategy?.budget || {}).map(([key, value]: [string, any]) => (
                    <div key={key} className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{value}%</div>
                      <div className="text-sm text-slate-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Campaign Structure */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Recommended Campaign Structure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {strategy?.campaigns.map((campaign: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{campaign}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* KPIs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Key Performance Indicators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {strategy?.kpis.map((kpi: any, index: number) => (
                    <div key={index} className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                      <div className="text-sm text-slate-600 mb-1">{kpi.metric}</div>
                      <div className="text-2xl font-bold text-green-700">{kpi.target}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Targeting & Creative */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Targeting Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{strategy?.targeting}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Creative Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{strategy?.creative}</p>
                </CardContent>
              </Card>
            </div>

            {/* CTA */}
            <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
              <CardContent className="pt-6 pb-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4">Ready to Implement?</h3>
                  <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                    Start your audit to see how your current setup compares to these best practices
                  </p>
                  <Link href="/audit">
                    <Button size="lg" variant="secondary">
                      Start Full Audit
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
