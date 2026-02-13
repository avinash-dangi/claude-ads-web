export type BusinessType =
  | 'saas'
  | 'ecommerce'
  | 'local-service'
  | 'b2b-enterprise'
  | 'info-products'
  | 'mobile-app'
  | 'real-estate'
  | 'healthcare'
  | 'finance'
  | 'agency'
  | 'generic';

export type Platform = 'google-ads' | 'meta-ads' | 'linkedin-ads' | 'tiktok-ads' | 'microsoft-ads';

export interface BusinessInfo {
  name: string;
  type: BusinessType;
  website?: string;
  monthlyBudget?: number;
  primaryGoal?: string;
}

export interface AuditFormData {
  businessInfo: BusinessInfo;
  selectedPlatforms: Platform[];
  accountAccess: {
    [key in Platform]?: {
      hasAccess: boolean;
      accessMethod: 'api' | 'export' | 'screenshots' | 'manual';
      apiCredentials?: string;
      files?: File[];
      notes?: string;
    };
  };
}

export const BUSINESS_TYPES = [
  {
    value: 'saas',
    label: 'SaaS',
    description: 'Software as a Service with trial/demo focus',
    icon: '💻',
  },
  {
    value: 'ecommerce',
    label: 'E-commerce',
    description: 'Online retail with product catalog',
    icon: '🛍️',
  },
  {
    value: 'local-service',
    label: 'Local Service',
    description: 'Service-based business with local targeting',
    icon: '🏪',
  },
  {
    value: 'b2b-enterprise',
    label: 'B2B Enterprise',
    description: 'Business-to-business with long sales cycle',
    icon: '🏢',
  },
  {
    value: 'info-products',
    label: 'Info Products',
    description: 'Courses, webinars, educational content',
    icon: '📚',
  },
  {
    value: 'mobile-app',
    label: 'Mobile App',
    description: 'App installs and in-app conversions',
    icon: '📱',
  },
  {
    value: 'real-estate',
    label: 'Real Estate',
    description: 'Property listings and lead generation',
    icon: '🏠',
  },
  {
    value: 'healthcare',
    label: 'Healthcare',
    description: 'Medical services with HIPAA compliance',
    icon: '⚕️',
  },
  {
    value: 'finance',
    label: 'Finance',
    description: 'Financial services with regulatory requirements',
    icon: '💰',
  },
  {
    value: 'agency',
    label: 'Agency',
    description: 'Managing multiple client accounts',
    icon: '🎯',
  },
  {
    value: 'generic',
    label: 'Other',
    description: 'General business type',
    icon: '🔷',
  },
] as const;

export const PLATFORM_INFO = [
  {
    value: 'google-ads',
    label: 'Google Ads',
    description: 'Search, Display, YouTube, Performance Max',
    icon: '🔍',
    checks: 74,
    color: 'blue',
  },
  {
    value: 'meta-ads',
    label: 'Meta Ads',
    description: 'Facebook, Instagram, Advantage+',
    icon: '📱',
    checks: 46,
    color: 'purple',
  },
  {
    value: 'linkedin-ads',
    label: 'LinkedIn Ads',
    description: 'B2B targeting, Lead Gen, Sponsored Content',
    icon: '💼',
    checks: 25,
    color: 'blue',
  },
  {
    value: 'tiktok-ads',
    label: 'TikTok Ads',
    description: 'Creative-first, Smart+, TikTok Shop',
    icon: '🎵',
    checks: 25,
    color: 'pink',
  },
  {
    value: 'microsoft-ads',
    label: 'Microsoft Ads',
    description: 'Bing Search, Copilot integration',
    icon: '🌐',
    checks: 20,
    color: 'green',
  },
] as const;
