import { create } from 'zustand';
import { AuditFormData, Platform } from '@/types/business';

interface AuditStore {
  formData: Partial<AuditFormData>;
  currentStep: number;
  setFormData: (data: Partial<AuditFormData>) => void;
  updateBusinessInfo: (info: Partial<AuditFormData['businessInfo']>) => void;
  togglePlatform: (platform: Platform) => void;
  setCurrentStep: (step: number) => void;
  resetForm: () => void;
}

const initialFormData: Partial<AuditFormData> = {
  businessInfo: {
    name: '',
    type: 'generic',
  },
  selectedPlatforms: [],
  accountAccess: {},
};

export const useAuditStore = create<AuditStore>((set) => ({
  formData: initialFormData,
  currentStep: 1,

  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  updateBusinessInfo: (info) =>
    set((state) => ({
      formData: {
        ...state.formData,
        businessInfo: {
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

  resetForm: () => set({ formData: initialFormData, currentStep: 1 }),
}));
