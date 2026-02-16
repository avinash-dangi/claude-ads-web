
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuditStore } from '@/store/audit-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, ChevronDown, ChevronRight, Play, Zap } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import BusinessInfoStep from './BusinessInfoStep';
import PlatformSelectionStep from './PlatformSelectionStep';
import QuestionnaireStep from './QuestionnaireStep';
import { googleAdsChecks } from '@/data/checklists/google-ads';
import { metaAdsChecks } from '@/data/checklists/meta-ads';
import { linkedinAdsChecks } from '@/data/checklists/linkedin-ads';
import { tiktokAdsChecks } from '@/data/checklists/tiktok-ads';
import { microsoftAdsChecks } from '@/data/checklists/microsoft-ads';
import { Platform } from '@/types/business';

const PLATFORM_CHECKS: Record<Platform, typeof googleAdsChecks> = {
    'google-ads': googleAdsChecks,
    'meta-ads': metaAdsChecks,
    'linkedin-ads': linkedinAdsChecks,
    'tiktok-ads': tiktokAdsChecks,
    'microsoft-ads': microsoftAdsChecks,
};

export default function SpeedAudit() {
    const router = useRouter();
    const { formData, currentPlatformForQuestionnaire, setCurrentPlatformForQuestionnaire } = useAuditStore();

    const [activeSection, setActiveSection] = useState<string>('business');
    const [isGenerating, setIsGenerating] = useState(false);

    // Auto-advance sections logic
    useEffect(() => {
        if (activeSection === 'business' && formData.businessInfo?.name && formData.businessInfo.type) {
            // Don't auto-close, just allow opening next
        }
    }, [formData.businessInfo, activeSection]);

    const toggleSection = (section: string) => {
        setActiveSection(activeSection === section ? '' : section);
    };

    const handleStartAudit = () => {
        if (formData.selectedPlatforms && formData.selectedPlatforms.length > 0) {
            setCurrentPlatformForQuestionnaire(formData.selectedPlatforms[0] as Platform);
            setActiveSection('audit');
        }
    };

    const handleAuditComplete = () => {
        if (currentPlatformForQuestionnaire && formData.selectedPlatforms) {
            const currentIndex = formData.selectedPlatforms.indexOf(currentPlatformForQuestionnaire);
            if (currentIndex < formData.selectedPlatforms.length - 1) {
                setCurrentPlatformForQuestionnaire(formData.selectedPlatforms[currentIndex + 1] as Platform);
            } else {
                setCurrentPlatformForQuestionnaire(null);
                handleGenerateReport();
            }
        }
    };

    const handleGenerateReport = () => {
        setIsGenerating(true);
        setTimeout(() => {
            router.push('/results');
        }, 1000);
    };

    // Status Indicators
    const isBusinessComplete = !!(formData.businessInfo?.name && formData.businessInfo?.type);
    const isPlatformsSelected = !!(formData.selectedPlatforms && formData.selectedPlatforms.length > 0);

    return (
        <div className="max-w-3xl mx-auto space-y-6">

            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-2xl mb-4">
                    <Zap className="w-8 h-8 text-indigo-600" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Speed Audit</h1>
                <p className="text-slate-500">
                    Complete the sections below to generate your AI-powered report.
                </p>
            </div>

            {/* Section 1: Business Info */}
            <Card className={`border-l-4 transition-all duration-300 ${isBusinessComplete ? 'border-l-green-400' : 'border-l-indigo-400'}`}>
                <Collapsible open={activeSection === 'business'} onOpenChange={() => toggleSection('business')}>
                    <CollapsibleTrigger className="w-full">
                        <CardHeader className="flex flex-row items-center justify-between p-6">
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isBusinessComplete ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'}`}>
                                    {isBusinessComplete ? <CheckCircle2 className="w-5 h-5" /> : '1'}
                                </div>
                                <div className="text-left">
                                    <CardTitle className="text-lg">Business Basics</CardTitle>
                                    <CardDescription>{formData.businessInfo?.name || 'Tell us about your company'}</CardDescription>
                                </div>
                            </div>
                            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === 'business' ? 'transform rotate-180' : ''}`} />
                        </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <CardContent className="pt-0 pb-6 px-6 pl-16">
                            <BusinessInfoStep />
                            <div className="mt-6 flex justify-end">
                                <Button onClick={() => setActiveSection('platforms')} disabled={!isBusinessComplete}>
                                    Next Step
                                </Button>
                            </div>
                        </CardContent>
                    </CollapsibleContent>
                </Collapsible>
            </Card>

            {/* Section 2: Platforms */}
            <Card className={`border-l-4 transition-all duration-300 ${isPlatformsSelected ? 'border-l-green-400' : 'border-l-indigo-400'}`}>
                <Collapsible open={activeSection === 'platforms'} onOpenChange={() => toggleSection('platforms')}>
                    <CollapsibleTrigger className="w-full">
                        <CardHeader className="flex flex-row items-center justify-between p-6">
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isPlatformsSelected ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'}`}>
                                    {isPlatformsSelected ? <CheckCircle2 className="w-5 h-5" /> : '2'}
                                </div>
                                <div className="text-left">
                                    <CardTitle className="text-lg">Connect Platforms</CardTitle>
                                    <CardDescription>
                                        {formData.selectedPlatforms?.length
                                            ? `${formData.selectedPlatforms.length} platform(s) selected`
                                            : 'Select ad accounts to audit'}
                                    </CardDescription>
                                </div>
                            </div>
                            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === 'platforms' ? 'transform rotate-180' : ''}`} />
                        </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <CardContent className="pt-0 pb-6 px-6 pl-16">
                            <PlatformSelectionStep />
                            <div className="mt-6 flex justify-end">
                                <Button onClick={handleStartAudit} disabled={!isPlatformsSelected}>
                                    Start Questionnaire
                                </Button>
                            </div>
                        </CardContent>
                    </CollapsibleContent>
                </Collapsible>
            </Card>

            {/* Section 3: The Audit */}
            <Card className={`border-l-4 transition-all duration-300 ${currentPlatformForQuestionnaire ? 'border-l-indigo-400' : 'border-l-slate-200'}`}>
                <div className="w-full">
                    <CardHeader className="flex flex-row items-center justify-between p-6">
                        <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentPlatformForQuestionnaire ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-400'}`}>
                                3
                            </div>
                            <div className="text-left">
                                <CardTitle className="text-lg">The Audit</CardTitle>
                                <CardDescription>
                                    {currentPlatformForQuestionnaire
                                        ? `Auditing ${currentPlatformForQuestionnaire}...`
                                        : 'Pending platform selection'}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    {activeSection === 'audit' && currentPlatformForQuestionnaire && (
                        <CardContent className="pt-0 pb-6 px-6">
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                <QuestionnaireStep
                                    platform={currentPlatformForQuestionnaire}
                                    checks={PLATFORM_CHECKS[currentPlatformForQuestionnaire]}
                                    onComplete={handleAuditComplete}
                                    onCancel={() => {
                                        setCurrentPlatformForQuestionnaire(null);
                                        setActiveSection('platforms');
                                    }}
                                />
                            </div>
                        </CardContent>
                    )}
                </div>
            </Card>

        </div>
    );
}
