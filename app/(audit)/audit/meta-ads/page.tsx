'use client';

import Link from 'next/link';
import { metaAdsAudit } from '@/data/checklists/meta-ads';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, BookOpen, CheckCircle2 } from 'lucide-react';

export default function MetaAdsAuditPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 py-12">
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
              📱
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Meta Ads Audit</h1>
              <p className="text-slate-600">
                Comprehensive analysis of your Facebook & Instagram campaigns
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Badge className="bg-purple-600">{metaAdsAudit.totalChecks} Checks</Badge>
            <Badge variant="outline">{metaAdsAudit.categories.length} Categories</Badge>
            <Badge variant="outline">Facebook • Instagram • Advantage+</Badge>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{metaAdsAudit.totalChecks}</div>
                  <div className="text-sm text-slate-600">Total Checks</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{metaAdsAudit.categories.length}</div>
                  <div className="text-sm text-slate-600">Categories</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Play className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">~12 min</div>
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
              Comprehensive checks across all critical areas of your Meta Ads account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {metaAdsAudit.categories.map((category) => (
                <div
                  key={category.name}
                  className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200"
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
                        className="bg-purple-600 rounded-full h-2"
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
            <CardDescription>What we'll be checking in your Meta Ads account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Pixel / CAPI Health (30%)
                </h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Meta Pixel installation and firing</li>
                  <li>• Conversions API (CAPI) implementation</li>
                  <li>• Event deduplication setup</li>
                  <li>• Event Match Quality (EMQ) scores</li>
                  <li>• Domain verification status</li>
                  <li>• Aggregated Event Measurement config</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Creative Diversity & Fatigue (30%)
                </h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Format diversity (image, video, carousel)</li>
                  <li>• Creative volume per ad set (5-8 ideal)</li>
                  <li>• Video aspect ratio optimization</li>
                  <li>• Creative fatigue detection</li>
                  <li>• UGC and social-native content</li>
                  <li>• Frequency monitoring</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Account Structure (20%)
                </h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Campaign count and consolidation</li>
                  <li>• Learning phase status</li>
                  <li>• CBO vs ABO appropriateness</li>
                  <li>• Advantage+ Sales campaign setup</li>
                  <li>• Budget distribution and adequacy</li>
                  <li>• A/B testing infrastructure</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                  Audience & Targeting (20%)
                </h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Audience overlap analysis</li>
                  <li>• Custom Audience freshness</li>
                  <li>• Lookalike source quality</li>
                  <li>• Advantage+ Audience testing</li>
                  <li>• Exclusion audiences setup</li>
                  <li>• First-party data utilization</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Special Features */}
        <Card className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle>Meta-Specific Optimizations</CardTitle>
            <CardDescription>Advanced checks unique to Meta's platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg">
                <h5 className="font-semibold mb-2">📊 iOS 14.5+ Optimization</h5>
                <p className="text-sm text-slate-600">
                  CAPI setup, Event Match Quality, and AEM configuration to recover lost tracking data
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <h5 className="font-semibold mb-2">🎨 Creative Best Practices</h5>
                <p className="text-sm text-slate-600">
                  Format diversity, fatigue detection, UGC integration, and Reels/Stories optimization
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <h5 className="font-semibold mb-2">🤖 Advantage+ Campaigns</h5>
                <p className="text-sm text-slate-600">
                  Advantage+ Shopping, Advantage+ App, and Advantage+ Audience implementation
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <h5 className="font-semibold mb-2">🎯 Learning Phase Management</h5>
                <p className="text-sm text-slate-600">
                  Minimize "Learning Limited" status and avoid unnecessary campaign resets
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-gradient-to-br from-purple-600 to-pink-600 text-white">
          <CardContent className="pt-6 pb-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Audit Your Meta Ads?</h3>
              <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
                Start your comprehensive {metaAdsAudit.totalChecks}-point audit and get actionable
                recommendations to improve your Facebook & Instagram campaign performance.
              </p>
              <Link href="/audit">
                <Button size="lg" variant="secondary" className="gap-2">
                  <Play className="w-4 h-4" />
                  Start Meta Ads Audit
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
