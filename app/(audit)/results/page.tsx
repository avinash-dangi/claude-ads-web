'use client';

import { useState } from 'react';
import { generateMockMultiPlatformReport } from '@/lib/utils/mock-audit-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Download,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Zap,
  Target,
  BarChart3,
} from 'lucide-react';
import ScoreCard from '@/components/audit/results/ScoreCard';
import FindingsList from '@/components/audit/results/FindingsList';
import ActionPlan from '@/components/audit/results/ActionPlan';
import QuickWins from '@/components/audit/results/QuickWins';
import CategoryBreakdown from '@/components/audit/results/CategoryBreakdown';

export default function ResultsPage() {
  const [report] = useState(() => generateMockMultiPlatformReport());
  const platformReport = report.platformReports[0]; // Currently showing Google Ads only

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    alert('PDF export coming soon!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Your Audit Report</h1>
              <p className="text-slate-600">
                Comprehensive analysis of your advertising accounts
              </p>
            </div>
            <Button onClick={handleExportPDF} className="gap-2">
              <Download className="w-4 h-4" />
              Export PDF
            </Button>
          </div>

          {/* Date */}
          <p className="text-sm text-slate-500">
            Generated on {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        {/* Overall Score Card */}
        <ScoreCard
          score={report.overallScore}
          grade={report.overallGrade}
          findings={platformReport.findings}
        />

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {platformReport.results.filter((r) => r.status === 'pass').length}
                  </div>
                  <div className="text-sm text-slate-600">Passing Checks</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {platformReport.results.filter((r) => r.status === 'warning').length}
                  </div>
                  <div className="text-sm text-slate-600">Warnings</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {platformReport.findings.critical + platformReport.findings.high}
                  </div>
                  <div className="text-sm text-slate-600">Critical Issues</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{platformReport.results.length}</div>
                  <div className="text-sm text-slate-600">Total Checks</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Wins */}
        {platformReport.quickWins.length > 0 && (
          <QuickWins quickWins={platformReport.quickWins} />
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="action-plan" className="mb-8">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="action-plan" className="gap-2">
              <Target className="w-4 h-4" />
              Action Plan
            </TabsTrigger>
            <TabsTrigger value="findings" className="gap-2">
              <AlertTriangle className="w-4 h-4" />
              Findings
            </TabsTrigger>
            <TabsTrigger value="categories" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              By Category
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Recommendations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="action-plan">
            <ActionPlan actionPlan={report.actionPlan} />
          </TabsContent>

          <TabsContent value="findings">
            <FindingsList report={platformReport} />
          </TabsContent>

          <TabsContent value="categories">
            <CategoryBreakdown report={platformReport} />
          </TabsContent>

          <TabsContent value="recommendations">
            <Card>
              <CardHeader>
                <CardTitle>Top Recommendations</CardTitle>
                <CardDescription>
                  Prioritized improvements based on your audit results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {platformReport.recommendations.slice(0, 10).map((rec, index) => (
                    <div key={index} className="flex gap-3 p-4 bg-slate-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{rec}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h3 className="text-2xl font-bold mb-4">Need Help Implementing These Changes?</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Our team of advertising experts can help you optimize your campaigns and achieve
                better results.
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="secondary" size="lg">
                  Schedule Consultation
                </Button>
                <Button variant="outline" size="lg" className="bg-transparent text-white border-white hover:bg-white/10">
                  Download Full Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
