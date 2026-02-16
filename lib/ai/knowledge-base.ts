
import fs from 'fs';
import path from 'path';

// Define the path to the reference repo relative to this project
// Assuming they are sibling directories as per the workspace listing
const REFERENCE_REPO_PATH = path.resolve(process.cwd(), '../claude-ads-reference');

export interface AgentInstructions {
    name: string;
    role: string;
    instructions: string;
}

export interface SkillInstructions {
    name: string;
    checklist: string;
}

export class KnowledgeBase {
    private static instance: KnowledgeBase;

    private constructor() { }

    public static getInstance(): KnowledgeBase {
        if (!KnowledgeBase.instance) {
            KnowledgeBase.instance = new KnowledgeBase();
        }
        return KnowledgeBase.instance;
    }

    /**
     * Reads an Agent definition file (e.g., agents/audit-google.md)
     * in a real app we might cache this, but fs read is fast enough for now.
     */
    public async getAgentInstructions(agentName: string): Promise<AgentInstructions | null> {
        try {
            const filePath = path.join(REFERENCE_REPO_PATH, 'agents', `${agentName}.md`);

            // Check if file exists
            if (!fs.existsSync(filePath)) {
                console.warn(`Agent file not found at: ${filePath}`);
                return null;
            }

            const content = fs.readFileSync(filePath, 'utf-8');

            // Minimal parsing to separate frontmatter (if needed) or just return full content
            // For now, we return the whole markdown as the "System Prompt"
            return {
                name: agentName,
                role: 'Specialist Auditor',
                instructions: content
            };
        } catch (error) {
            console.error('Failed to read agent instructions:', error);
            return null;
        }
    }

    /**
     * Reads a Skill definition file (e.g., skills/ads-google/SKILL.md)
     */
    public async getSkillInstructions(skillName: string): Promise<SkillInstructions | null> {
        try {
            const filePath = path.join(REFERENCE_REPO_PATH, 'skills', skillName, 'SKILL.md');

            if (!fs.existsSync(filePath)) {
                console.warn(`Skill file not found at: ${filePath}`);
                return null;
            }

            const content = fs.readFileSync(filePath, 'utf-8');

            return {
                name: skillName,
                checklist: content
            };
        } catch (error) {
            console.error('Failed to read skill instructions:', error);
            return null;
        }
    }
}
