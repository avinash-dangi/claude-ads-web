import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Zap, CheckCircle2, Shield } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col justify-center">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center max-w-4xl">
        <Badge className="mb-6 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-none px-4 py-1.5 text-sm rounded-full">
          ✨ AI-Powered Ad Auditing
        </Badge>

        <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight text-foreground">
          Audit your ads in <br />
          <span className="text-primary">30 seconds</span>
        </h1>

        <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Stop guessing. Get a professional, AI-generated audit of your Google, Meta, and LinkedIn ad accounts instantly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link href="/audit">
            <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg shadow-indigo-200 hover:shadow-xl transition-all gap-2">
              Start Speed Audit
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <div className="text-sm text-slate-400">
            No credit card required
          </div>
        </div>

        {/* Quick Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Instant Results</h3>
            <p className="text-slate-500">Connect your account and get a comprehensive report in under a minute.</p>
          </div>
          <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg mb-2">190+ Checks</h3>
            <p className="text-slate-500">Our AI checks for wasted spend, creative fatigue, and tracking errors.</p>
          </div>
          <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-4">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Secure & Private</h3>
            <p className="text-slate-500">Read-only access. We check your stats, we don't touch your ads.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
