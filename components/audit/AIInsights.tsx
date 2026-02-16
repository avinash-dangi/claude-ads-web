'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Sparkles, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface AIInsightsProps {
    data: any;
}

export default function AIInsights({ data }: AIInsightsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState<string | null>(null);

    const startAnalysis = () => {
        setIsLoading(true);
        setTimeout(() => {
            setAnalysis(`Based on your audit score of ${data?.score || 0}/100 (Grade: ${data?.grade || 'N/A'}):

• Critical Issues: ${data?.summary?.critical || 0}
• Warnings: ${data?.summary?.warnings || 0}

Your account has significant room for improvement. Focus on addressing the critical findings first, particularly around conversion tracking and account structure.

Top Priority Areas:
1. Conversion Tracking Setup
2. Negative Keyword Management
3. Account Structure Optimization

Consider running a detailed audit to identify specific opportunities for improvement.`);
            setIsLoading(false);
        }, 2000);
    };

    return (
        <Card className="border-indigo-100 bg-indigo-50/50 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <div className="p-2 bg-indigo-100 rounded-xl">
                    <Bot className="w-5 h-5 text-indigo-600" />
                </div>
                <CardTitle className="text-lg text-indigo-900 font-semibold">AI Consultant Analysis</CardTitle>
            </CardHeader>
            <CardContent>
                {!analysis ? (
                    <div className="text-center py-6">
                        <p className="text-slate-600 mb-4 text-sm">
                            Get a professional deep-dive analysis of your results.
                        </p>
                        <Button
                            onClick={startAnalysis}
                            disabled={isLoading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 shadow-md shadow-indigo-200"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                            Start AI Analysis
                        </Button>
                    </div>
                ) : (
                    <div className="prose prose-sm max-w-none text-slate-700 bg-white p-4 rounded-xl border border-indigo-100 shadow-sm whitespace-pre-wrap">
                        {analysis}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
