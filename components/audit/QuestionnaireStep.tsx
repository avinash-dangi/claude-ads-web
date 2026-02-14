'use client';

import { useState, useEffect } from 'react';
import { useAuditStore } from '@/store/audit-store';
import { Platform } from '@/types/business';
import { AuditCheck, CheckStatus } from '@/types/audit';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight, AlertCircle, CheckCircle, AlertTriangle, Download } from 'lucide-react';
import QuestionnaireHeader from './QuestionnaireHeader';
import ResponseValidator from './ResponseValidator';
import { estimateTimeRemaining, exportResponsesAsJSON, exportResponsesAsCSV } from '@/lib/utils/response-export';

interface QuestionnaireStepProps {
  platform: Platform;
  checks: AuditCheck[];
  onComplete: () => void;
  onCancel: () => void;
}

export default function QuestionnaireStep({
  platform,
  checks,
  onComplete,
  onCancel,
}: QuestionnaireStepProps) {
  const { updateAuditResponse, getAuditResponses } = useAuditStore();
  const [currentCheckIndex, setCurrentCheckIndex] = useState(0);
  const [responses, setResponses] = useState<Map<string, { status: CheckStatus; notes: string }>>(
    new Map(
      getAuditResponses(platform).map((r) => [
        r.checkId,
        { status: r.status, notes: r.notes || '' },
      ])
    )
  );

  const currentCheck = checks[currentCheckIndex];
  const currentResponse = responses.get(currentCheck.id) || { status: 'pass', notes: '' };
  const progress = ((currentCheckIndex + 1) / checks.length) * 100;
  const totalAnswered = Array.from(responses.values()).filter(
    (r) => r.status !== 'not-applicable'
  ).length;

  const handleStatusChange = (status: CheckStatus) => {
    const newResponses = new Map(responses);
    newResponses.set(currentCheck.id, { ...currentResponse, status });
    setResponses(newResponses);
  };

  const handleNotesChange = (notes: string) => {
    const newResponses = new Map(responses);
    newResponses.set(currentCheck.id, { ...currentResponse, notes });
    setResponses(newResponses);
  };

  const handleNext = () => {
    // Save current response
    updateAuditResponse(platform, currentCheck.id, {
      checkId: currentCheck.id,
      status: currentResponse.status,
      notes: currentResponse.notes,
    });

    if (currentCheckIndex < checks.length - 1) {
      setCurrentCheckIndex(currentCheckIndex + 1);
    }
  };

  const handlePrevious = () => {
    // Save current response
    updateAuditResponse(platform, currentCheck.id, {
      checkId: currentCheck.id,
      status: currentResponse.status,
      notes: currentResponse.notes,
    });

    if (currentCheckIndex > 0) {
      setCurrentCheckIndex(currentCheckIndex - 1);
    }
  };

  const handleComplete = () => {
    // Save final response
    updateAuditResponse(platform, currentCheck.id, {
      checkId: currentCheck.id,
      status: currentResponse.status,
      notes: currentResponse.notes,
    });
    onComplete();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertCircle className="w-4 h-4" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4" />;
      case 'low':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const timeRemaining = estimateTimeRemaining(currentCheckIndex, checks.length);

  const handleExportJSON = () => {
    const exportData = Array.from(responses.values()).map((value, index) => ({
      checkId: Array.from(responses.keys())[index],
      status: value.status,
      notes: value.notes,
    }));
    exportResponsesAsJSON(platform, 'Audit Responses', exportData as any);
  };

  const handleExportCSV = () => {
    const exportData = Array.from(responses.values()).map((value, index) => ({
      checkId: Array.from(responses.keys())[index],
      status: value.status,
      notes: value.notes,
    }));
    exportResponsesAsCSV(platform, 'Audit Responses', exportData as any);
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <QuestionnaireHeader
        platform={platform}
        currentCheckIndex={currentCheckIndex}
        totalChecks={checks.length}
        responses={responses}
        estimatedTimeRemaining={timeRemaining}
      />

      {/* Response Validator */}
      <ResponseValidator checks={checks} responses={responses} />

      {/* Check details */}
      <Card className="p-6 border-l-4" style={{ borderLeftColor: getSeverityColor(currentCheck.severity).split(' ')[0].replace('bg-', '#') }}>
        <div className="space-y-4">
          {/* Check title and severity */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-lg font-semibold">{currentCheck.check}</h4>
              <Badge className={getSeverityColor(currentCheck.severity)}>
                <span className="flex items-center gap-1">
                  {getSeverityIcon(currentCheck.severity)}
                  {currentCheck.severity.charAt(0).toUpperCase() + currentCheck.severity.slice(1)}
                </span>
              </Badge>
            </div>
            <p className="text-sm text-slate-600">
              Category: <span className="font-medium">{currentCheck.category}</span>
            </p>
          </div>

          {/* Check description */}
          {currentCheck.description && (
            <p className="text-base text-slate-700 bg-slate-50 p-3 rounded border border-slate-200">
              {currentCheck.description}
            </p>
          )}

          {/* Criteria guidance */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded border border-slate-200">
            <div>
              <p className="text-xs font-semibold text-green-700 uppercase mb-1">✓ Pass</p>
              <p className="text-sm text-slate-700">{currentCheck.pass}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-yellow-700 uppercase mb-1">⚠ Warning</p>
              <p className="text-sm text-slate-700">{currentCheck.warning}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-red-700 uppercase mb-1">✗ Fail</p>
              <p className="text-sm text-slate-700">{currentCheck.fail}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Response selection */}
      <div className="space-y-4">
        <h5 className="font-semibold">What is the status of this check?</h5>
        <RadioGroup value={currentResponse.status} onValueChange={handleStatusChange}>
          <div className="flex items-center space-x-2 p-3 border rounded hover:bg-slate-50 cursor-pointer transition">
            <RadioGroupItem value="pass" id="pass" />
            <Label htmlFor="pass" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-2">
                <span className="text-green-600 font-semibold">✓ Pass</span>
                <span className="text-sm text-slate-600">This requirement is met</span>
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-3 border rounded hover:bg-slate-50 cursor-pointer transition">
            <RadioGroupItem value="warning" id="warning" />
            <Label htmlFor="warning" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-2">
                <span className="text-yellow-600 font-semibold">⚠ Warning</span>
                <span className="text-sm text-slate-600">Partially implemented or needs attention</span>
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-3 border rounded hover:bg-slate-50 cursor-pointer transition">
            <RadioGroupItem value="fail" id="fail" />
            <Label htmlFor="fail" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-2">
                <span className="text-red-600 font-semibold">✗ Fail</span>
                <span className="text-sm text-slate-600">This requirement is not met</span>
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-3 border rounded hover:bg-slate-50 cursor-pointer transition">
            <RadioGroupItem value="not-applicable" id="not-applicable" />
            <Label htmlFor="not-applicable" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-2">
                <span className="text-slate-600 font-semibold">— N/A</span>
                <span className="text-sm text-slate-600">Not applicable to your setup</span>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Notes field */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="font-semibold">
          Additional Notes (Optional)
        </Label>
        <Textarea
          id="notes"
          placeholder="Add any notes about this check (e.g., details about your implementation, challenges, or findings)..."
          value={currentResponse.notes}
          onChange={(e) => handleNotesChange(e.target.value)}
          className="min-h-24"
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4 border-t">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentCheckIndex === 0}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            className="gap-2"
          >
            Cancel
          </Button>
        </div>

        <div className="flex gap-2">
          {/* Export Buttons */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExportJSON}
            title="Export responses as JSON"
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            JSON
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExportCSV}
            title="Export responses as CSV"
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            CSV
          </Button>
        </div>

        {currentCheckIndex < checks.length - 1 ? (
          <Button onClick={handleNext} className="gap-2">
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button onClick={handleComplete} className="gap-2 bg-green-600 hover:bg-green-700">
            Complete {platform} Audit
            <CheckCircle className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Skip message */}
      {currentResponse.status === 'not-applicable' && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
          This check will be marked as not applicable in your final report.
        </div>
      )}
    </div>
  );
}
