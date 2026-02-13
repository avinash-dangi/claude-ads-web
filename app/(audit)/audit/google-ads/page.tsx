'use client';

import Link from 'next/link';
import { googleAdsAudit } from '@/data/checklists/google-ads';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, BookOpen, CheckCircle2 } from 'lucide-react';

export default function GoogleAdsAuditPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center text-4xl">
              🔍
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Google Ads Audit</h1>
              <p className="text-slate-600">
                Comprehensive analysis of your Google Ads campaigns
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Badge className="bg-blue-600">{googleAdsAudit.totalChecks} Checks</Badge>
            <Badge variant="outline">{googleAdsAudit.categories.length} Categories</Badge>
            <Badge variant="outline">Search, PMax, Display, YouTube</Badge>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{googleAdsAudit.totalChecks}</div>
                  <div className="text-sm text-slate-600">Total Checks</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{googleAdsAudit.categories.length}</div>
                  <div className="text-sm text-slate-600">Categories</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Play className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">~15 min</div>
                  <div className="text-sm text-slate-600">Audit Duration</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Categories */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Audit Categories</CardTitle>
            <CardDescription>
              Comprehensive checks across all critical areas of your Google Ads account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {googleAdsAudit.categories.map((category) => (
                <div
                  key={category.name}
                  className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <Badge variant="secondary">{category.checkCount} checks</Badge>
                  </div>
                  {category.description && (
                    <p className="text-sm text-slate-600 mb-3">{category.description}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 rounded-full h-2"
                        style={{ width: `${category.weight * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-slate-600">
                      {(category.weight * 100).toFixed(0)}% weight
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Focus Areas */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Key Focus Areas</CardTitle>
            <CardDescription>What we'll be checking in your Google Ads account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Conversion Tracking (25%)
                </h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Enhanced Conversions setup</li>
                  <li>• GA4 integration and data flow</li>
                  <li>• Server-side tracking implementation</li>
                  <li>• Consent Mode v2 compliance</li>
                  <li>• Attribution model configuration</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Wasted Spend & Negatives (20%)
                </h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Search term audit frequency</li>
                  <li>• Negative keyword list coverage</li>
                  <li>• Irrelevant search term spend</li>
                  <li>• Broad Match + Smart Bidding pairing</li>
                  <li>• Zero-conversion keyword analysis</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  Account Structure (15%)
                </h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Campaign naming conventions</li>
                  <li>• Brand vs non-brand separation</li>
                  <li>• PMax + Search overlap management</li>
                  <li>• Budget allocation strategy</li>
                  <li>• Geographic targeting accuracy</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Keywords & Quality Score (15%)
                </h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Average Quality Score analysis</li>
                  <li>• Expected CTR performance</li>
                  <li>• Ad relevance scoring</li>
                  <li>• Landing page experience</li>
                  <li>• Top keyword optimization</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Ads & Assets (15%)
                </h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• RSA completeness and Ad Strength</li>
                  <li>• PMax asset density (images, videos, logos)</li>
                  <li>• Ad copy freshness</li>
                  <li>• Keyword-to-ad relevance</li>
                  <li>• CTR vs industry benchmarks</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Settings & Targeting (10%)
                </h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Extensions coverage (sitelinks, callouts)</li>
                  <li>• Audience segment application</li>
                  <li>• Customer Match list management</li>
                  <li>• Landing page speed and relevance</li>
                  <li>• Placement exclusions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <CardContent className="pt-6 pb-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Audit Your Google Ads?</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Start your comprehensive {googleAdsAudit.totalChecks}-point audit and get actionable
                recommendations to improve your campaign performance.
              </p>
              <Link href="/audit">
                <Button size="lg" variant="secondary" className="gap-2">
                  <Play className="w-4 h-4" />
                  Start Google Ads Audit
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
