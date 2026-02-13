'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play } from 'lucide-react';

export default function LinkedInAdsAuditPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center text-4xl">
              💼
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">LinkedIn Ads Audit</h1>
              <p className="text-slate-600">B2B advertising optimization and lead generation</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Badge className="bg-blue-700">25 Checks</Badge>
            <Badge variant="outline">B2B Focus</Badge>
            <Badge variant="outline">Lead Gen • ABM • TLA</Badge>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Key Focus Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2">🎯 B2B Targeting</h4>
                <p className="text-sm text-slate-600">
                  Company size, industry, job titles, seniority, and account-based marketing lists
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2">📋 Lead Gen Forms</h4>
                <p className="text-sm text-slate-600">
                  Form design, field optimization, auto-fill settings, and conversion optimization
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2">💰 Thought Leader Ads</h4>
                <p className="text-sm text-slate-600">
                  TLA implementation, engagement amplification, and executive visibility
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2">📊 Conversion Tracking</h4>
                <p className="text-sm text-slate-600">
                  Insight Tag implementation, conversion events, and attribution windows
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-700 to-cyan-700 text-white">
          <CardContent className="pt-6 pb-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Start Your LinkedIn Ads Audit</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Coming soon: Comprehensive B2B advertising audit with 25 specialized checks
              </p>
              <Link href="/audit">
                <Button size="lg" variant="secondary" className="gap-2">
                  <Play className="w-4 h-4" />
                  Start Audit
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
