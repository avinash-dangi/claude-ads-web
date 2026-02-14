'use client';

import { AuditCheck } from '@/types/audit';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface ResponseValidatorProps {
  checks: AuditCheck[];
  responses: Map<string, { status: string; notes: string }>;
  onProceed?: () => void;
  onReview?: () => void;
}

export default function ResponseValidator({
  checks,
  responses,
  onProceed,
  onReview,
}: ResponseValidatorProps) {
  const answered = responses.size;
  const total = checks.length;
  const percentage = total > 0 ? Math.round((answered / total) * 100) : 0;
  const isComplete = percentage >= 80; // 80% threshold
  const unansweredChecks = checks.filter((c) => !responses.has(c.id));

  if (isComplete) {
    return (
      <Card className="bg-green-50 border-green-200 mb-6">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-green-900 mb-1">Great! You've answered enough questions</h4>
              <p className="text-sm text-green-800 mb-3">
                You've answered {answered} of {total} checks ({percentage}%). You can proceed to complete this platform
                audit.
              </p>
              {onProceed && (
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Proceed to Results
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-yellow-50 border-yellow-200 mb-6">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-yellow-900 mb-1">Complete more questions</h4>
            <p className="text-sm text-yellow-800 mb-3">
              You've answered {answered} of {total} checks ({percentage}%). Please answer at least 80% to continue.
            </p>

            {unansweredChecks.length > 0 && unansweredChecks.length <= 5 && (
              <div className="mb-3 p-2 bg-white rounded border border-yellow-200">
                <p className="text-xs font-medium text-yellow-900 mb-2">Unanswered checks:</p>
                <ul className="text-xs text-yellow-800 space-y-1">
                  {unansweredChecks.slice(0, 5).map((check) => (
                    <li key={check.id} className="line-clamp-2">
                      • {check.check}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {onReview && (
              <Button size="sm" variant="outline" onClick={onReview}>
                Review Unanswered Questions
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
