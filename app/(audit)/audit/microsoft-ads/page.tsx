'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play } from 'lucide-react';

export default function MicrosoftAdsAuditPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 py-12">
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
              🌐
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Microsoft Ads Audit</h1>
              <p className="text-slate-600">Bing Search and Microsoft Audience Network</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Badge className="bg-green-600">20 Checks</Badge>
            <Badge variant="outline">Bing Focus</Badge>
            <Badge variant="outline">Import • Copilot • MSAN</Badge>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Key Focus Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold mb-2">📥 Google Import</h4>
                <p className="text-sm text-slate-600">
                  Campaign import validation, settings sync, and performance comparison
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold mb-2">🤖 Copilot Integration</h4>
                <p className="text-sm text-slate-600">
                  Copilot placement opportunities, AI-powered search integration
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold mb-2">📊 UET Tag</h4>
                <p className="text-sm text-slate-600">
                  Universal Event Tracking setup, conversion goals, and enhanced conversions
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold mb-2">🎯 MSAN</h4>
                <p className="text-sm text-slate-600">
                  Microsoft Audience Network placement strategy and performance
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-600 to-emerald-700 text-white">
          <CardContent className="pt-6 pb-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Start Your Microsoft Ads Audit</h3>
              <p className="text-green-100 mb-6 max-w-2xl mx-auto">
                Coming soon: Comprehensive Bing search audit with 20 specialized checks
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
