import { create } from 'zustand';
import { AuditFormData, Platform } from '@/types/business';
import { AuditResult } from '@/types/audit';

interface AuditStore {
  formData: Partial<AuditFormData>;
  currentStep: number;
  currentPlatformForQuestionnaire: Platform | null;
  auditResponses: Map<Platform, AuditResult[]>;
  setFormData: (data: Partial<AuditFormData>) => void;
  updateBusinessInfo: (info: Partial<AuditFormData['businessInfo']>) => void;
  togglePlatform: (platform: Platform) => void;
  setCurrentStep: (step: number) => void;
  setCurrentPlatformForQuestionnaire: (platform: Platform | null) => void;
  addAuditResponse: (platform: Platform, response: AuditResult) => void;
  updateAuditResponse: (platform: Platform, checkId: string, response: Partial<AuditResult>) => void;
  getAuditResponses: (platform: Platform) => AuditResult[];
  resetForm: () => void;
  saveAuditToDb: (platform: Platform, score: number, data: any) => Promise<{ error: any }>;
}

const initialFormData: Partial<AuditFormData> = {
  businessInfo: {
    name: '',
    type: 'generic',
  },
  selectedPlatforms: [],
  accountAccess: {},
};

export const useAuditStore = create<AuditStore>((set, get) => ({
  formData: initialFormData,
  currentStep: 1,
  currentPlatformForQuestionnaire: null,
  auditResponses: new Map(),

  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  updateBusinessInfo: (info) =>
    set((state) => ({
      formData: {
        ...state.formData,
        businessInfo: {
          name: state.formData.businessInfo?.name || '',
          type: state.formData.businessInfo?.type || 'generic',
          ...state.formData.businessInfo,
          ...info,
        },
      },
    })),

  togglePlatform: (platform) =>
    set((state) => {
      const currentPlatforms = state.formData.selectedPlatforms || [];
      const isSelected = currentPlatforms.includes(platform);

      return {
        formData: {
          ...state.formData,
          selectedPlatforms: isSelected
            ? currentPlatforms.filter((p) => p !== platform)
            : [...currentPlatforms, platform],
        },
      };
    }),

  setCurrentStep: (step) => set({ currentStep: step }),

  setCurrentPlatformForQuestionnaire: (platform) =>
    set({ currentPlatformForQuestionnaire: platform }),

  addAuditResponse: (platform, response) =>
    set((state) => {
      const newResponses = new Map(state.auditResponses);
      const platformResponses = newResponses.get(platform) || [];
      newResponses.set(platform, [...platformResponses, response]);
      return { auditResponses: newResponses };
    }),

  updateAuditResponse: (platform, checkId, response) =>
    set((state) => {
      const newResponses = new Map(state.auditResponses);
      const platformResponses = newResponses.get(platform) || [];
      const index = platformResponses.findIndex((r) => r.checkId === checkId);
      if (index >= 0) {
        platformResponses[index] = { ...platformResponses[index], ...response };
        newResponses.set(platform, platformResponses);
      } else {
        const newResponse: AuditResult = {
          checkId,
          status: response.status || 'pass',
          notes: response.notes,
          impact: response.impact,
        };
        newResponses.set(platform, [...platformResponses, newResponse]);
      }
      return { auditResponses: newResponses };
    }),

  getAuditResponses: (platform) => {
    const state = get();
    return state.auditResponses.get(platform) || [];
  },

  resetForm: () =>
    set({
      formData: initialFormData,
      currentStep: 1,
      currentPlatformForQuestionnaire: null,
      auditResponses: new Map(),
    }),

  saveAuditToDb: async (platform: Platform, score: number, data: any) => {
    // Dynamically import to avoid SSR issues with client-side only modules if needed
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'User not authenticated' };

    const { error } = await supabase.from('audits').insert({
      user_id: user.id,
      platform,
      score,
      data,
      project_name: get().formData.businessInfo?.name || 'Untitled Audit',
    });

    return { error };
  },
}));
