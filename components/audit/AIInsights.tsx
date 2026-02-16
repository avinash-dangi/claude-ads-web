
'use client';

import { useChat } from 'ai/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Sparkles, Loader2 } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface AIInsightsProps {
    data: any; // The audit data to analyze
}

export default function AIInsights({ data }: AIInsightsProps) {
    const { messages, append, isLoading, error } = useChat({
        api: '/api/audit/generate',
    });

    const hasStarted = useRef(false);

    const startAnalysis = () => {
        if (hasStarted.current) return;
        hasStarted.current = true;

        append({
            role: 'user',
            content: `Here is the account data for analysis: ${JSON.stringify(data, null, 2)}`,
        });
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
                {messages.length === 0 ? (
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
                    <div className="prose prose-sm max-w-none text-slate-700 bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                        {messages.filter(m => m.role === 'assistant').map((m, i) => (
                            <div key={i} className="whitespace-pre-wrap">
                                {m.content}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-center gap-2 text-indigo-600 mt-4 text-xs font-medium uppercase tracking-wide">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                <span>Analyzing expert rules...</span>
                            </div>
                        )}
                        {error && (
                            <div className="text-red-500 mt-2 bg-red-50 p-2 rounded text-sm">
                                Error: {error.message}. Please check your API Key.
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
