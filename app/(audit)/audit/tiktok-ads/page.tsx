'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play } from 'lucide-react';

export default function TikTokAdsAuditPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-rose-50 py-12">
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
              🎵
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">TikTok Ads Audit</h1>
              <p className="text-slate-600">Creative-first advertising and viral content</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Badge className="bg-pink-600">25 Checks</Badge>
            <Badge variant="outline">Creative Focus</Badge>
            <Badge variant="outline">Smart+ • TikTok Shop • Spark Ads</Badge>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Key Focus Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-pink-50 rounded-lg">
                <h4 className="font-semibold mb-2">🎨 Creative Strategy</h4>
                <p className="text-sm text-slate-600">
                  Native, vertical video content, hooks, trends, and sound-on optimization
                </p>
              </div>
              <div className="p-4 bg-pink-50 rounded-lg">
                <h4 className="font-semibold mb-2">🤖 Smart+ Campaigns</h4>
                <p className="text-sm text-slate-600">
                  Automated campaign optimization, creative testing, and audience expansion
                </p>
              </div>
              <div className="p-4 bg-pink-50 rounded-lg">
                <h4 className="font-semibold mb-2">🛍️ TikTok Shop</h4>
                <p className="text-sm text-slate-600">
                  Product listings, live shopping, creator partnerships, and conversion tracking
                </p>
              </div>
              <div className="p-4 bg-pink-50 rounded-lg">
                <h4 className="font-semibold mb-2">✨ Spark Ads</h4>
                <p className="text-sm text-slate-600">
                  Organic post boosting, creator collaborations, and engagement amplification
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-600 to-rose-600 text-white">
          <CardContent className="pt-6 pb-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Start Your TikTok Ads Audit</h3>
              <p className="text-pink-100 mb-6 max-w-2xl mx-auto">
                Coming soon: Comprehensive creative-focused audit with 25 specialized checks
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
