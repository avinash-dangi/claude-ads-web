'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuditStore } from '@/store/audit-store';
import { Platform } from '@/types/business';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BusinessInfoStep from '@/components/audit/BusinessInfoStep';
import PlatformSelectionStep from '@/components/audit/PlatformSelectionStep';
import QuestionnaireStep from '@/components/audit/QuestionnaireStep';
import ReviewStep from '@/components/audit/ReviewStep';
import { googleAdsChecks } from '@/data/checklists/google-ads';
import { metaAdsChecks } from '@/data/checklists/meta-ads';
import { linkedinAdsChecks } from '@/data/checklists/linkedin-ads';
import { tiktokAdsChecks } from '@/data/checklists/tiktok-ads';
import { microsoftAdsChecks } from '@/data/checklists/microsoft-ads';

const STEPS = [
  { id: 1, name: 'Business Info', description: 'Tell us about your business' },
  { id: 2, name: 'Select Platforms', description: 'Choose platforms to audit' },
  { id: 3, name: 'Audit Questionnaire', description: 'Answer questions about your accounts' },
  { id: 4, name: 'Review', description: 'Review and submit' },
];

const PLATFORM_CHECKS: Record<Platform, typeof googleAdsChecks> = {
  'google-ads': googleAdsChecks,
  'meta-ads': metaAdsChecks,
  'linkedin-ads': linkedinAdsChecks,
  'tiktok-ads': tiktokAdsChecks,
  'microsoft-ads': microsoftAdsChecks,
};

export default function AuditPage() {
  const router = useRouter();
  const {
    currentStep,
    setCurrentStep,
    formData,
    currentPlatformForQuestionnaire,
    setCurrentPlatformForQuestionnaire,
  } = useAuditStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const progress = (currentStep / STEPS.length) * 100;

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.businessInfo?.name && formData.businessInfo?.type;
      case 2:
        return formData.selectedPlatforms && formData.selectedPlatforms.length > 0;
      case 3:
        // All platforms must have responses
        return (
          formData.selectedPlatforms &&
          formData.selectedPlatforms.every(
            (platform) =>
              PLATFORM_CHECKS[platform as Platform].length === 0 ||
              true // Questionnaire sets currentPlatformForQuestionnaire
          )
        );
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep === 2) {
      // When leaving platform selection, start questionnaire with first platform
      if (formData.selectedPlatforms && formData.selectedPlatforms.length > 0) {
        setCurrentPlatformForQuestionnaire(formData.selectedPlatforms[0] as Platform);
      }
    }
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep === 3) {
      setCurrentPlatformForQuestionnaire(null);
    }
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleQuestionnaireComplete = () => {
    if (currentPlatformForQuestionnaire && formData.selectedPlatforms) {
      const currentIndex = formData.selectedPlatforms.indexOf(currentPlatformForQuestionnaire);
      if (currentIndex < formData.selectedPlatforms.length - 1) {
        // Move to next platform
        setCurrentPlatformForQuestionnaire(
          formData.selectedPlatforms[currentIndex + 1] as Platform
        );
      } else {
        // All platforms completed, move to review
        setCurrentPlatformForQuestionnaire(null);
        setCurrentStep(4);
      }
    }
  };

  const handleQuestionnaireCancel = () => {
    setCurrentPlatformForQuestionnaire(null);
    setCurrentStep(2); // Go back to platform selection
  };

  const handleGenerateReport = () => {
    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      router.push('/results');
    }, 1500);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BusinessInfoStep />;
      case 2:
        return <PlatformSelectionStep />;
      case 3:
        if (currentPlatformForQuestionnaire) {
          const checks = PLATFORM_CHECKS[currentPlatformForQuestionnaire];
          return (
            <QuestionnaireStep
              platform={currentPlatformForQuestionnaire}
              checks={checks}
              onComplete={handleQuestionnaireComplete}
              onCancel={handleQuestionnaireCancel}
            />
          );
        }
        return null;
      case 4:
        return <ReviewStep />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Start Your Ad Audit</h1>
          <p className="text-slate-600">
            Complete the form below to get your comprehensive ad performance report
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="mb-4">
              <Progress value={progress} className="h-2" />
            </div>
            <div className="flex justify-between">
              {STEPS.map((step) => (
                <div
                  key={step.id}
                  className={`flex-1 text-center ${
                    currentStep === step.id
                      ? 'text-blue-600 font-semibold'
                      : currentStep > step.id
                      ? 'text-green-600'
                      : 'text-slate-400'
                  }`}
                >
                  <div className="text-sm mb-1">Step {step.id}</div>
                  <div className="text-xs hidden sm:block">{step.name}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{STEPS[currentStep - 1].name}</CardTitle>
            <CardDescription>{STEPS[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent>{renderStep()}</CardContent>
        </Card>

        {/* Navigation - only show for non-questionnaire steps */}
        {currentStep !== 3 && (
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>

            {currentStep < STEPS.length ? (
              <Button onClick={handleNext} disabled={!canProceed()} className="gap-2">
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleGenerateReport} disabled={isGenerating} className="gap-2">
                {isGenerating ? 'Generating...' : 'Generate Report'}
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
