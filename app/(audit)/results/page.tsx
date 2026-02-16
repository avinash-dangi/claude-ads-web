'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useAuditStore } from '@/store/audit-store';
import { generateAuditReport, isQuestionnaireComplete } from '@/lib/utils/results-service';
import { generatePDFReportData, generatePDFFilename } from '@/lib/utils/pdf-generator';
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
  AlertCircle,
} from 'lucide-react';
import AIInsights from '@/components/audit/AIInsights';

// ... existing imports

export default function ResultsPage() {
  // ... existing code

  return (
    <div className="min-h-screen bg-background py-12 text-slate-800">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold mb-2 text-foreground">Audit Report</h1>
          <p className="text-slate-500 mb-6">
            {report.platformReports.length === 1
              ? `${report.platformReports[0].platform} Analysis`
              : `${report.platformReports.length} Platforms Analysis`}
            <span className="mx-2">•</span>
            Generated {new Date().toLocaleDateString()}
          </p>

          <div className="flex justify-center gap-3">
            <Button onClick={handleSave} disabled={saving} variant="outline" className="gap-2 border-slate-200">
              {saving ? 'Saving...' : 'Save Report'}
            </Button>
            <PDFDownloadLink
              document={<AuditReportPDF formData={formData} report={report} />}
              fileName={pdfFilename}
            >
              {({ blob, url, loading, error }) => (
                <Button disabled={loading} variant="default" className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                  <Download className="w-4 h-4" />
                  {loading ? 'Generating...' : 'Download PDF'}
                </Button>
              )}
            </PDFDownloadLink>
          </div>
        </div>

        {/* AI Insights Section */}
        <div className="mb-10">
          <AIInsights data={{
            score: report.overallScore,
            grade: report.overallGrade,
            summary: aggregatedMetrics,
            topIssues: report.topIssues.slice(0, 3)
          }} />
        </div>

        {/* Overall Score Card */}
        <div className="mb-10">
          <ScoreCard
            score={report.overallScore}
            grade={report.overallGrade}
            findings={{
              critical: aggregatedMetrics.critical,
              high: report.platformReports.reduce((sum, p) => sum + p.findings.high, 0),
              medium: report.platformReports.reduce((sum, p) => sum + p.findings.medium, 0),
              low: report.platformReports.reduce((sum, p) => sum + p.findings.low, 0),
            }}
          />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="p-4 bg-green-50 rounded-2xl border border-green-100 text-center">
            <div className="text-2xl font-bold text-green-700">{aggregatedMetrics.passing}</div>
            <div className="text-sm text-green-600">Passing</div>
          </div>
          <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100 text-center">
            <div className="text-2xl font-bold text-yellow-700">{aggregatedMetrics.warnings}</div>
            <div className="text-sm text-yellow-600">Warnings</div>
          </div>
          <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-center">
            <div className="text-2xl font-bold text-red-700">{aggregatedMetrics.critical}</div>
            <div className="text-sm text-red-600">Critical</div>
          </div>
          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-center">
            <div className="text-2xl font-bold text-blue-700">{aggregatedMetrics.totalChecks}</div>
            <div className="text-sm text-blue-600">Checks</div>
          </div>
        </div>

        {/* Platform Selection Tabs (if multiple platforms) */}
        {report.platformReports.length > 1 && (
          <Tabs defaultValue={report.platformReports[0].platform} className="mb-8">
            <TabsList className="grid w-full mb-8 bg-slate-100/50 p-1 rounded-xl" style={{ gridTemplateColumns: `repeat(${Math.min(report.platformReports.length, 4)}, minmax(0, 1fr))` }}>
              {report.platformReports.map((p) => (
                <TabsTrigger key={p.platform} value={p.platform} className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  {p.platform.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </TabsTrigger>
              ))}
            </TabsList>

            {report.platformReports.map((p) => (
              <TabsContent key={p.platform} value={p.platform}>
                <div className="space-y-8">
                  {/* Platform Quick Wins */}
                  {p.quickWins.length > 0 && (
                    <QuickWins quickWins={p.quickWins} />
                  )}

                  {/* Platform Tabs */}
                  <Tabs defaultValue="action-plan" className="mb-0">
                    <TabsList className="grid w-full grid-cols-3 mb-6 bg-slate-100/50 p-1 rounded-xl">
                      <TabsTrigger value="action-plan" className="gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Target className="w-4 h-4" />
                        Action Plan
                      </TabsTrigger>
                      <TabsTrigger value="findings" className="gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <AlertTriangle className="w-4 h-4" />
                        Findings
                      </TabsTrigger>
                      <TabsTrigger value="recommendations" className="gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <TrendingUp className="w-4 h-4" />
                        Top Recs
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="action-plan">
                      <ActionPlan actionPlan={report.actionPlan.filter((item) => item.platform === p.platform)} />
                    </TabsContent>

                    <TabsContent value="findings">
                      <FindingsList report={p} />
                    </TabsContent>

                    <TabsContent value="recommendations">
                      <Card className="border-none shadow-none bg-slate-50/50">
                        <CardHeader>
                          <CardTitle>Top Recommendations</CardTitle>
                          <CardDescription>
                            Prioritized improvements for {p.platform}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {p.recommendations.slice(0, 5).map((rec, index) => (
                              <div key={index} className="flex gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                                <div className="flex-shrink-0">
                                  <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">
                                    {index + 1}
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm text-slate-700">{rec}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}

        {/* Single Platform View */}
        {report.platformReports.length === 1 && (
          <div className="space-y-8">
            {/* Quick Wins */}
            {report.platformReports[0].quickWins.length > 0 && (
              <QuickWins quickWins={report.platformReports[0].quickWins} />
            )}

            {/* Main Content Tabs */}
            <Tabs defaultValue="action-plan" className="mb-8">
              <TabsList className="grid w-full grid-cols-3 mb-6 bg-slate-100/50 p-1 rounded-xl">
                <TabsTrigger value="action-plan" className="gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Target className="w-4 h-4" />
                  Action Plan
                </TabsTrigger>
                <TabsTrigger value="findings" className="gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <AlertTriangle className="w-4 h-4" />
                  Findings
                </TabsTrigger>
                <TabsTrigger value="recommendations" className="gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <TrendingUp className="w-4 h-4" />
                  Recommendations
                </TabsTrigger>
              </TabsList>

              <TabsContent value="action-plan">
                <ActionPlan actionPlan={report.actionPlan} />
              </TabsContent>

              <TabsContent value="findings">
                <FindingsList report={report.platformReports[0]} />
              </TabsContent>

              <TabsContent value="recommendations">
                <Card className="border-none shadow-none bg-slate-50/50">
                  <CardHeader>
                    <CardTitle>Top Recommendations</CardTitle>
                    <CardDescription>
                      Prioritized improvements based on your audit results
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {report.platformReports[0].recommendations.slice(0, 10).map((rec, index) => (
                        <div key={index} className="flex gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                          <div className="flex-shrink-0">
                            <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-slate-700">{rec}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-bold mb-2">Need Expert Help?</h3>
          <p className="text-slate-500 mb-6">
            Our team can help you implement these changes.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="default" className="bg-slate-900 text-white hover:bg-slate-800">
              Book Consultation
            </Button>
            <Button variant="ghost">
              Download Full Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
