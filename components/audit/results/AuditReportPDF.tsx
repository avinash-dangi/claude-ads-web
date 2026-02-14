'use client';

import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
import { MultiPlatformAudit } from '@/types/audit';
import { AuditFormData } from '@/types/business';
import { generatePDFReportData, getSeverityColor, formatPercentage } from '@/lib/utils/pdf-generator';

interface AuditReportPDFProps {
  formData: Partial<AuditFormData>;
  report: MultiPlatformAudit;
}

const styles = StyleSheet.create({
  // Document
  document: {
    backgroundColor: '#ffffff',
  },

  // Page styles
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.6,
    color: '#1f2937',
  },

  // Cover page
  coverPage: {
    padding: 60,
    justifyContent: 'center',
    backgroundColor: '#0f172a',
  },

  coverTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },

  coverSubtitle: {
    fontSize: 20,
    color: '#e5e7eb',
    marginBottom: 40,
    textAlign: 'center',
  },

  coverContent: {
    marginTop: 40,
    borderTop: 2,
    borderTopColor: '#3b82f6',
    paddingTop: 30,
  },

  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },

  coverDate: {
    fontSize: 12,
    color: '#9ca3af',
  },

  // Headers
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
    color: '#1e293b',
    borderBottom: 2,
    borderBottomColor: '#3b82f6',
    paddingBottom: 10,
  },

  subHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 15,
    color: '#334155',
  },

  // Score card
  scoreCard: {
    backgroundColor: '#f8fafc',
    padding: 20,
    marginBottom: 20,
    borderRadius: 8,
    border: 1,
    borderColor: '#e2e8f0',
  },

  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#3b82f6',
  },

  scoreGrade: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#16a34a',
  },

  scoreLabel: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 5,
  },

  // Metrics
  metricsContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },

  metricCard: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    padding: 15,
    borderRadius: 6,
  },

  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 5,
  },

  metricLabel: {
    fontSize: 11,
    color: '#64748b',
  },

  // Tables
  table: {
    marginBottom: 20,
  },

  tableRow: {
    flexDirection: 'row',
    borderBottom: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 8,
    marginBottom: 8,
  },

  tableHeader: {
    fontWeight: 'bold',
    backgroundColor: '#f0f4f8',
    paddingBottom: 10,
    marginBottom: 10,
  },

  tableCell: {
    flex: 1,
    paddingRight: 10,
  },

  // Findings
  findingItem: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottom: 1,
    borderBottomColor: '#e2e8f0',
  },

  findingTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1e293b',
  },

  findingSeverity: {
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 5,
    width: 'fit-content',
  },

  findingDescription: {
    fontSize: 10,
    color: '#475569',
  },

  // Lists
  list: {
    marginBottom: 15,
  },

  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },

  listBullet: {
    width: 15,
    fontSize: 11,
  },

  listContent: {
    flex: 1,
    fontSize: 11,
    color: '#475569',
  },

  // Footer
  footer: {
    fontSize: 9,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 30,
    paddingTop: 15,
    borderTop: 1,
    borderTopColor: '#e2e8f0',
  },

  // Platform section
  platformContainer: {
    marginBottom: 30,
    pageBreak: 'after',
  },

  platformBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    marginBottom: 15,
    width: 'fit-content',
  },

  // Text
  text: {
    fontSize: 11,
    marginBottom: 10,
  },

  textSmall: {
    fontSize: 9,
    color: '#64748b',
  },
});

export default function AuditReportPDF({
  formData,
  report,
}: AuditReportPDFProps) {
  const data = generatePDFReportData(formData, report);

  return (
    <Document title={`Audit Report - ${data.company.name}`}>
      {/* Cover Page */}
      <Page size="A4" style={[styles.page, styles.coverPage]}>
        <View style={styles.coverTitle}>Advertising Audit Report</View>
        <View style={styles.coverSubtitle}>Comprehensive Platform Analysis</View>

        <View style={styles.coverContent}>
          <Text style={styles.companyName}>{data.company.name}</Text>
          <Text style={styles.coverDate}>Generated: {data.company.generatedDate}</Text>
          {data.company.website && (
            <Text style={[styles.coverDate, { marginTop: 5 }]}>
              Website: {data.company.website}
            </Text>
          )}
        </View>

        <View
          style={{
            marginTop: 60,
            padding: 20,
            backgroundColor: '#1e293b',
            borderRadius: 8,
          }}
        >
          <View style={{ marginBottom: 15 }}>
            <Text style={{ color: '#9ca3af', fontSize: 12 }}>Overall Health Score</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, marginTop: 10 }}>
              <Text style={{ fontSize: 56, fontWeight: 'bold', color: data.overall.gradeColor }}>
                {data.overall.score}
              </Text>
              <Text style={{ fontSize: 48, fontWeight: 'bold', color: data.overall.gradeColor }}>
                {data.overall.grade}
              </Text>
            </View>
          </View>
          <Text style={{ color: '#d1d5db', fontSize: 11 }}>
            Platforms Audited: {data.overall.platformCount}
          </Text>
        </View>
      </Page>

      {/* Executive Summary Page */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Executive Summary</Text>

        <View style={styles.scoreCard}>
          <View style={styles.scoreContainer}>
            <View>
              <Text style={styles.scoreLabel}>Overall Health Score</Text>
              <Text style={styles.scoreValue}>{data.overall.score}/100</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.scoreLabel}>Grade</Text>
              <Text
                style={[
                  styles.scoreGrade,
                  { color: data.overall.gradeColor },
                ]}
              >
                {data.overall.grade}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.subHeader}>Key Metrics</Text>
        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{data.summary.passingChecks}</Text>
            <Text style={styles.metricLabel}>Passing Checks</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{data.summary.warningChecks}</Text>
            <Text style={styles.metricLabel}>Warnings</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{data.summary.criticalIssues}</Text>
            <Text style={styles.metricLabel}>Critical Issues</Text>
          </View>
        </View>

        <Text style={styles.subHeader}>Platforms Audited</Text>
        {data.platforms.map((platform, idx) => (
          <View key={idx} style={styles.tableRow}>
            <View style={[styles.tableCell, { flex: 2 }]}>
              <Text style={{ fontWeight: 'bold' }}>{platform.name}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>{platform.score}/100</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={{ fontWeight: 'bold', color: platform.gradeColor }}>
                {platform.grade}
              </Text>
            </View>
            <View style={styles.tableCell}>
              <Text>{platform.totalChecks} checks</Text>
            </View>
          </View>
        ))}

        <Text style={[styles.subHeader, { marginTop: 30 }]}>Top Quick Wins</Text>
        <View style={styles.list}>
          {data.quickWins.map((win, idx) => (
            <View key={idx} style={styles.listItem}>
              <Text style={styles.listBullet}>•</Text>
              <Text style={styles.listContent}>
                {win.win} ({win.platform})
              </Text>
            </View>
          ))}
        </View>
      </Page>

      {/* Platform Pages */}
      {data.platforms.map((platform, idx) => (
        <Page key={idx} size="A4" style={styles.page}>
          <View style={styles.platformBadge}>
            <Text>{platform.name}</Text>
          </View>

          {/* Score */}
          <View style={styles.scoreCard}>
            <View style={styles.scoreContainer}>
              <View>
                <Text style={styles.scoreLabel}>Health Score</Text>
                <Text style={styles.scoreValue}>{platform.score}/100</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.scoreLabel}>Grade</Text>
                <Text style={[styles.scoreGrade, { color: platform.gradeColor }]}>
                  {platform.grade}
                </Text>
              </View>
            </View>
          </View>

          {/* Metrics */}
          <Text style={styles.subHeader}>Audit Results</Text>
          <View style={styles.metricsContainer}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{platform.passingPercentage}%</Text>
              <Text style={styles.metricLabel}>Passing</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{platform.findings.critical}</Text>
              <Text style={styles.metricLabel}>Critical</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{platform.findings.high}</Text>
              <Text style={styles.metricLabel}>High</Text>
            </View>
          </View>

          {/* Findings Summary */}
          <Text style={styles.subHeader}>Issues Summary</Text>
          <View style={styles.table}>
            {[
              { label: 'Critical', value: platform.findings.critical, color: '#ef4444' },
              { label: 'High', value: platform.findings.high, color: '#f97316' },
              { label: 'Medium', value: platform.findings.medium, color: '#eab308' },
              { label: 'Low', value: platform.findings.low, color: '#3b82f6' },
            ].map((item, i) => (
              <View key={i} style={styles.tableRow}>
                <View style={[styles.tableCell, { flex: 2 }]}>
                  <Text style={{ fontWeight: 'bold' }}>{item.label}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>{item.value} issues</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Top Recommendations */}
          <Text style={styles.subHeader}>Top Recommendations</Text>
          <View style={styles.list}>
            {platform.topRecommendations.map((rec, i) => (
              <View key={i} style={styles.listItem}>
                <Text style={styles.listBullet}>{i + 1}.</Text>
                <Text style={styles.listContent}>{rec}</Text>
              </View>
            ))}
          </View>
        </Page>
      ))}

      {/* Action Plan Page */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Action Plan</Text>

        <Text style={styles.text}>
          Prioritized list of improvements across all platforms. Focus on high-priority items
          first to maximize impact on your advertising performance.
        </Text>

        <View style={styles.list}>
          {data.actionPlan.map((action, idx) => (
            <View key={idx} style={styles.findingItem}>
              <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                <Text style={{ fontWeight: 'bold', width: 30 }}>
                  {action.priority}.
                </Text>
                <Text style={{ fontWeight: 'bold', flex: 1 }}>
                  {action.action}
                </Text>
              </View>
              <Text style={styles.textSmall}>Platform: {action.platform}</Text>
              <Text style={styles.textSmall}>Impact: {action.impact}</Text>
              <Text style={styles.textSmall}>Effort: {action.effort}</Text>
            </View>
          ))}
        </View>
      </Page>

      {/* Footer on all pages */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>About This Report</Text>

        <Text style={styles.text}>
          This comprehensive audit report evaluates your advertising accounts across multiple
          platforms using industry best practices and proven optimization frameworks.
        </Text>

        <Text style={[styles.text, { marginTop: 20, fontWeight: 'bold' }]}>
          Key Metrics Explained:
        </Text>

        <View style={styles.list}>
          <View style={styles.listItem}>
            <Text style={styles.listBullet}>•</Text>
            <Text style={styles.listContent}>
              <Text style={{ fontWeight: 'bold' }}>Health Score (0-100):</Text> Overall account
              health rating
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listBullet}>•</Text>
            <Text style={styles.listContent}>
              <Text style={{ fontWeight: 'bold' }}>Grade (A-F):</Text> Performance rating based on
              score
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listBullet}>•</Text>
            <Text style={styles.listContent}>
              <Text style={{ fontWeight: 'bold' }}>Critical Issues:</Text> Urgent problems requiring
              immediate attention
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listBullet}>•</Text>
            <Text style={styles.listContent}>
              <Text style={{ fontWeight: 'bold' }}>Quick Wins:</Text> Easy fixes with high impact
            </Text>
          </View>
        </View>

        <Text style={[styles.text, { marginTop: 30 }]}>
          For questions about this report or to discuss implementation of recommendations, please
          contact our team.
        </Text>

        <Text style={styles.footer}>
          Generated by Claude Ads Audit Platform | {data.company.generatedDate}
        </Text>
      </Page>
    </Document>
  );
}
