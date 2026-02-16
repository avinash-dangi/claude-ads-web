'use client';

import { useState, useEffect, useMemo } from 'react';
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
import AuditReportPDF from '@/components/audit/results/AuditReportPDF';
import ScoreCard from '@/components/audit/results/ScoreCard';
import QuickWins from '@/components/audit/results/QuickWins';
import ActionPlan from '@/components/audit/results/ActionPlan';
import FindingsList from '@/components/audit/results/FindingsList';

export default function ResultsPage() {
  const router = useRouter();
  const { formData, auditResponses } = useAuditStore();
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [branding, setBranding] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    loadBranding();
  }, []);

  const loadBranding = async () => {
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (data) {
          setBranding(data);
        }
      }
    } catch (error) {
      console.error('Error loading branding:', error);
    }
  };

  const selectedPlatforms = useMemo(() => {
    return (formData.selectedPlatforms || []) as any[];
  }, [formData.selectedPlatforms]);

  const report = useMemo(() => {
    if (!mounted) return null;
    return generateAuditReport({
      formData,
      auditResponses,
      selectedPlatforms,
    });
  }, [formData, auditResponses, selectedPlatforms, mounted]);

  const aggregatedMetrics = useMemo(() => {
    if (!report) return { passing: 0, warnings: 0, critical: 0, totalChecks: 0 };
    
    let passing = 0;
    let warnings = 0;
    let critical = 0;
    let totalChecks = 0;

    report.platformReports.forEach((p) => {
      passing += p.findings.low + p.findings.medium;
      warnings += p.findings.high;
      critical += p.findings.critical;
      totalChecks += p.results.length;
    });

    return { passing, warnings, critical, totalChecks };
  }, [report]);

  const pdfFilename = useMemo(() => {
    if (!report || !formData.businessInfo?.name) return 'audit_report.pdf';
    return generatePDFFilename(formData.businessInfo.name);
  }, [report, formData.businessInfo?.name]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { saveAuditToDb } = useAuditStore.getState();
      for (const platform of selectedPlatforms) {
        const platformReport = report?.platformReports.find((p) => p.platform === platform);
        if (platformReport) {
          await saveAuditToDb(platform, platformReport.score, platformReport);
        }
      }
    } catch (error) {
      console.error('Error saving audit:', error);
    }
    setSaving(false);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!report || report.platformReports.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">No Audit Data</CardTitle>
            <CardDescription className="text-center">
              Complete an audit first to view results.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/audit')} className="w-full">
              Start New Audit
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 text-slate-800">
      <div className="container mx-auto px-4 max-w-5xl">
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
              document={<AuditReportPDF formData={formData} report={report} branding={branding} />}
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

        <div className="mb-10">
          <AIInsights data={{
            score: report.overallScore,
            grade: report.overallGrade,
            summary: aggregatedMetrics,
            topIssues: report.topIssues.slice(0, 3)
          }} />
        </div>

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

        {report.platformReports.length > 1 ? (
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
                <Card className="mb-6">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {p.platform.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                          <Badge variant={p.grade === 'A' ? 'default' : p.grade === 'F' ? 'destructive' : 'secondary'}>
                            {p.grade}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          Score: {p.score}/100 • {p.results.length} checks evaluated
                        </CardDescription>
                      </div>
                      <div className="text-3xl font-bold text-slate-700">{p.score}</div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ActionPlan actionPlan={report.actionPlan.filter((item: any) => item.platform === p.platform)} />
                    <FindingsList report={p} />
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div>
            {report.platformReports[0].quickWins.length > 0 && (
              <div className="mb-8">
                <QuickWins quickWins={report.platformReports[0].quickWins} />
              </div>
            )}

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Detailed Findings</CardTitle>
              </CardHeader>
              <CardContent>
                <ActionPlan actionPlan={report.actionPlan} />
                <FindingsList report={report.platformReports[0]} />
              </CardContent>
            </Card>

            {report.platformReports[0].recommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Top Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {report.platformReports[0].recommendations.slice(0, 10).map((rec, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                        <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-700">{rec}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <div className="mt-16 text-center">
          <h3 className="text-xl font-bold mb-2">Need Expert Help?</h3>
          <p className="text-slate-500 mb-6">
            Our team can help you implement these changes.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="default" className="bg-slate-900 text-white hover:bg-slate-800">
              Book Consultation
            </Button>
            <Button variant="ghost" onClick={() => router.push('/audit')}>
              Start New Audit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
