
import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import { KnowledgeBase } from '@/lib/ai/knowledge-base';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages, data } = await req.json();

    // Load the "Expert Brain" from the reference repo
    const kb = KnowledgeBase.getInstance();
    const agentDocs = await kb.getAgentInstructions('audit-google');
    const skillDocs = await kb.getSkillInstructions('ads-google');

    // Build the System Prompt
    const systemPrompt = `
    You are an expert Google Ads Auditor.
    
    YOUR INSTRUCTIONS:
    ${agentDocs?.instructions || 'Analyze the provided ad data.'}
    
    YOUR CHECKLISTS:
    ${skillDocs?.checklist || ''}

    TASK:
    Analyze the provided ad account data and provide a professional audit report.
    Focus on finding "wasted spend" and "missed opportunities".
    Be concise, actionable, and cite specific checks (e.g., "Failed check G12").
  `;

    const result = await streamText({
        model: anthropic('claude-3-5-sonnet-20240620'),
        system: systemPrompt,
        messages,
        // Provide the data as a separate input or tool context if needed, 
        // but for simple text generation, appending it to the user message is easiest.
    });

    return result.toDataStreamResponse();
}
