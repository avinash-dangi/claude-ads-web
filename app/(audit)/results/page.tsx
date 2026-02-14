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
import AuditReportPDF from '@/components/audit/results/AuditReportPDF';
import ScoreCard from '@/components/audit/results/ScoreCard';
import FindingsList from '@/components/audit/results/FindingsList';
import ActionPlan from '@/components/audit/results/ActionPlan';
import QuickWins from '@/components/audit/results/QuickWins';
import CategoryBreakdown from '@/components/audit/results/CategoryBreakdown';
import type { MultiPlatformAudit } from '@/types/audit';

export default function ResultsPage() {
  const router = useRouter();
  const { formData, auditResponses } = useAuditStore();
  const selectedPlatforms = formData.selectedPlatforms || [];
  const [report, setReport] = useState<MultiPlatformAudit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Check if user came here without completing questionnaire
      if (!selectedPlatforms || selectedPlatforms.length === 0) {
        setError('No platforms selected. Please start the audit form again.');
        setLoading(false);
        return;
      }

      // Check if questionnaire is complete
      const isComplete = isQuestionnaireComplete(selectedPlatforms, auditResponses);
      if (!isComplete) {
        setError('Questionnaire not completed for all platforms. Please complete the audit form.');
        setLoading(false);
        return;
      }

      // Generate report from real responses
      const generatedReport = generateAuditReport({
        formData: formData || {},
        auditResponses,
        selectedPlatforms,
      });

      setReport(generatedReport);
      setError(null);
    } catch (err) {
      console.error('Error generating report:', err);
      setError('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [formData, auditResponses]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
        <div className="container mx-auto px-4 max-w-7xl text-center py-20">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p className="mt-4 text-slate-600">Calculating your audit report...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <Card className="bg-red-50 border-red-200 mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900 mb-2">Unable to Generate Report</h3>
                  <p className="text-red-800 mb-4">{error || 'Unknown error occurred'}</p>
                  <Button onClick={() => router.push('/audit')} variant="outline">
                    Return to Audit Form
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Aggregate metrics across all platforms
  const aggregatedMetrics = {
    passing: report.platformReports.reduce((sum, p) => sum + p.results.filter((r) => r.status === 'pass').length, 0),
    warnings: report.platformReports.reduce((sum, p) => sum + p.results.filter((r) => r.status === 'warning').length, 0),
    critical: report.platformReports.reduce((sum, p) => sum + p.findings.critical, 0),
    totalChecks: report.platformReports.reduce((sum, p) => sum + p.results.length, 0),
  };

  const pdfFilename = generatePDFFilename(formData.businessInfo?.name || 'Audit Report');

  const handleBackToAudit = () => {
    router.push('/audit');
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
                {report.platformReports.length === 1
                  ? `Comprehensive analysis of your ${report.platformReports[0].platform}`
                  : `Comprehensive analysis of ${report.platformReports.length} advertising platforms`}
              </p>
            </div>
            <PDFDownloadLink
              document={<AuditReportPDF formData={formData} report={report} />}
              fileName={pdfFilename}
            >
              {({ blob, url, loading, error }) => (
                <Button disabled={loading} className="gap-2">
                  <Download className="w-4 h-4" />
                  {loading ? 'Generating...' : 'Export PDF'}
                </Button>
              )}
            </PDFDownloadLink>
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
          findings={{
            critical: aggregatedMetrics.critical,
            high: report.platformReports.reduce((sum, p) => sum + p.findings.high, 0),
            medium: report.platformReports.reduce((sum, p) => sum + p.findings.medium, 0),
            low: report.platformReports.reduce((sum, p) => sum + p.findings.low, 0),
          }}
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
                  <div className="text-2xl font-bold">{aggregatedMetrics.passing}</div>
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
                  <div className="text-2xl font-bold">{aggregatedMetrics.warnings}</div>
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
                  <div className="text-2xl font-bold">{aggregatedMetrics.critical}</div>
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
                  <div className="text-2xl font-bold">{aggregatedMetrics.totalChecks}</div>
                  <div className="text-sm text-slate-600">Total Checks</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Selection Tabs (if multiple platforms) */}
        {report.platformReports.length > 1 && (
          <Tabs defaultValue={report.platformReports[0].platform} className="mb-8">
            <TabsList className="grid w-full mb-4" style={{ gridTemplateColumns: `repeat(${Math.min(report.platformReports.length, 4)}, minmax(0, 1fr))` }}>
              {report.platformReports.map((p) => (
                <TabsTrigger key={p.platform} value={p.platform}>
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
                    <TabsList className="grid w-full grid-cols-3 mb-8">
                      <TabsTrigger value="action-plan" className="gap-2">
                        <Target className="w-4 h-4" />
                        Action Plan
                      </TabsTrigger>
                      <TabsTrigger value="findings" className="gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Findings
                      </TabsTrigger>
                      <TabsTrigger value="recommendations" className="gap-2">
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
                      <Card>
                        <CardHeader>
                          <CardTitle>Top Recommendations</CardTitle>
                          <CardDescription>
                            Prioritized improvements for {p.platform}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {p.recommendations.slice(0, 5).map((rec, index) => (
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
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="action-plan" className="gap-2">
                  <Target className="w-4 h-4" />
                  Action Plan
                </TabsTrigger>
                <TabsTrigger value="findings" className="gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Findings
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
                <FindingsList report={report.platformReports[0]} />
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
                      {report.platformReports[0].recommendations.slice(0, 10).map((rec, index) => (
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
          </div>
        )}

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
