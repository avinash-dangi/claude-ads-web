import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  Target,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Zap,
  Shield,
  Gauge
} from 'lucide-react';

const platforms = [
  {
    name: 'Google Ads',
    checks: 74,
    icon: '🔍',
    description: 'Search, PMax, Display, YouTube, Demand Gen',
    color: 'bg-blue-500',
  },
  {
    name: 'Meta Ads',
    checks: 46,
    icon: '📱',
    description: 'Facebook, Instagram, Advantage+ Shopping',
    color: 'bg-purple-500',
  },
  {
    name: 'LinkedIn Ads',
    checks: 25,
    icon: '💼',
    description: 'B2B targeting, Lead Gen, TLA',
    color: 'bg-blue-600',
  },
  {
    name: 'TikTok Ads',
    checks: 25,
    icon: '🎵',
    description: 'Creative-first, Smart+, TikTok Shop',
    color: 'bg-pink-500',
  },
  {
    name: 'Microsoft Ads',
    checks: 20,
    icon: '🌐',
    description: 'Bing, Copilot, Import validation',
    color: 'bg-green-600',
  },
];

const features = [
  {
    icon: Gauge,
    title: 'Ads Health Score',
    description: '0-100 scoring with weighted severity algorithm and actionable grading.',
  },
  {
    icon: CheckCircle2,
    title: '190 Audit Checks',
    description: 'Comprehensive coverage across all platforms with prioritized findings.',
  },
  {
    icon: Target,
    title: 'Industry Templates',
    description: 'Strategic plans for SaaS, e-commerce, B2B, local service, and more.',
  },
  {
    icon: Shield,
    title: 'Compliance Verification',
    description: 'Auto-check Special Ad Categories and regulatory requirements.',
  },
  {
    icon: TrendingUp,
    title: 'Optimization Roadmap',
    description: 'Prioritized action plan with quick wins and long-term strategies.',
  },
  {
    icon: Zap,
    title: 'Quality Gates',
    description: 'Hard rules for bidding, budget sufficiency, and learning phases.',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge className="mb-4" variant="outline">
          Professional Ad Audit Tool
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Claude Ads
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 mb-4 max-w-3xl mx-auto">
          Comprehensive paid advertising audit and optimization
        </p>
        <p className="text-lg text-slate-500 mb-8 max-w-2xl mx-auto">
          Get actionable insights to improve your ad performance across Google Ads, Meta Ads, LinkedIn, TikTok, and Microsoft Ads
        </p>

        <div className="flex gap-4 justify-center mb-12">
          <Link href="/audit">
            <Button size="lg" className="gap-2">
              Start Full Audit
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/plan">
            <Button size="lg" variant="outline" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Create Strategy Plan
            </Button>
          </Link>
        </div>

        <div className="flex justify-center gap-8 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span>190 Audit Checks</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span>5 Platforms</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span>11 Industry Templates</span>
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">Supported Platforms</h2>
        <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
          Deep analysis for each platform with specialized audit checklists
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {platforms.map((platform) => (
            <Card key={platform.name} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-4xl">{platform.icon}</span>
                  <Badge variant="secondary">{platform.checks} checks</Badge>
                </div>
                <CardTitle>{platform.name}</CardTitle>
                <CardDescription>{platform.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/audit/${platform.name.toLowerCase().replace(' ', '-')}`}>
                  <Button variant="ghost" className="w-full gap-2">
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 bg-white/50 rounded-3xl my-16">
        <h2 className="text-3xl font-bold text-center mb-4">Features</h2>
        <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
          Everything you need for professional ad account analysis
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to optimize your ads?</h2>
          <p className="text-lg mb-8 text-blue-100">
            Get a comprehensive audit report with prioritized action items in minutes
          </p>
          <Link href="/audit">
            <Button size="lg" variant="secondary" className="gap-2">
              Start Your Free Audit
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
