import { AuditCheck, AuditCategory, PlatformAudit } from '@/types/audit';

export const metaAdsCategories: AuditCategory[] = [
  {
    name: 'Pixel / CAPI Health',
    weight: 0.30,
    checkCount: 10,
    description: 'Conversion tracking and data quality',
  },
  {
    name: 'Creative Diversity & Fatigue',
    weight: 0.30,
    checkCount: 12,
    description: 'Creative performance and freshness',
  },
  {
    name: 'Account Structure',
    weight: 0.20,
    checkCount: 18,
    description: 'Campaign organization and optimization',
  },
  {
    name: 'Audience & Targeting',
    weight: 0.20,
    checkCount: 6,
    description: 'Audience configuration and overlap',
  },
];

export const metaAdsChecks: AuditCheck[] = [
  // Pixel / CAPI Health (30% weight) - Sample checks
  {
    id: 'M01',
    check: 'Meta Pixel installed',
    severity: 'critical',
    category: 'Pixel / CAPI Health',
    pass: 'Pixel firing on all pages',
    warning: 'Firing on most pages (>90%)',
    fail: 'Pixel not firing',
  },
  {
    id: 'M02',
    check: 'Conversions API (CAPI) active',
    severity: 'critical',
    category: 'Pixel / CAPI Health',
    pass: 'Server-side events sending alongside pixel',
    warning: 'CAPI planned but not deployed',
    fail: 'No CAPI (30-40% data loss post-iOS 14.5)',
  },
  {
    id: 'M03',
    check: 'Event deduplication',
    severity: 'critical',
    category: 'Pixel / CAPI Health',
    pass: 'event_id matching between pixel and CAPI events; ≥90% dedup rate',
    warning: 'event_id present but <90% dedup rate',
    fail: 'Missing event_id (double-counting)',
  },
  {
    id: 'M04',
    check: 'Event Match Quality (EMQ)',
    severity: 'critical',
    category: 'Pixel / CAPI Health',
    pass: 'EMQ ≥8.0 for Purchase event',
    warning: 'EMQ 6.0-7.9',
    fail: 'EMQ <6.0',
  },
  {
    id: 'M05',
    check: 'Domain verification',
    severity: 'high',
    category: 'Pixel / CAPI Health',
    pass: 'Business domain verified in Business Manager',
    warning: '—',
    fail: 'Domain not verified',
  },

  // Creative Diversity & Fatigue (30% weight) - Sample checks
  {
    id: 'M25',
    check: 'Creative format diversity',
    severity: 'critical',
    category: 'Creative Diversity & Fatigue',
    pass: '≥3 formats active (static image, video, carousel)',
    warning: '2 formats',
    fail: 'Only 1 format used',
  },
  {
    id: 'M26',
    check: 'Creative volume per ad set',
    severity: 'high',
    category: 'Creative Diversity & Fatigue',
    pass: '≥5 creatives per ad set (ideal: 5-8 for Andromeda)',
    warning: '3-4 creatives',
    fail: '<3 creatives per ad set',
  },
  {
    id: 'M28',
    check: 'Creative fatigue detection',
    severity: 'critical',
    category: 'Creative Diversity & Fatigue',
    pass: 'No creatives with CTR drop >20% over 14 days while active',
    warning: 'CTR drop 10-20%',
    fail: 'CTR drop >20% + frequency >3 (fatigue confirmed)',
  },
  {
    id: 'M31',
    check: 'UGC / social-native content',
    severity: 'high',
    category: 'Creative Diversity & Fatigue',
    pass: '≥30% of creative assets are UGC or social-native',
    warning: '10-30% UGC content',
    fail: '<10% UGC (all polished/corporate)',
  },

  // Account Structure (20% weight) - Sample checks
  {
    id: 'M13',
    check: 'Learning phase status',
    severity: 'critical',
    category: 'Account Structure',
    pass: '<30% of ad sets in "Learning Limited"',
    warning: '30-50% Learning Limited',
    fail: '>50% ad sets "Learning Limited"',
  },
  {
    id: 'M15',
    check: 'Advantage+ Sales campaign',
    severity: 'medium',
    category: 'Account Structure',
    pass: 'ASC active for e-commerce with catalog',
    warning: 'ASC tested but paused',
    fail: 'Not tested despite eligible catalog',
  },
  {
    id: 'M16',
    check: 'Ad set consolidation',
    severity: 'high',
    category: 'Account Structure',
    pass: 'No overlapping ad sets targeting same audience',
    warning: 'Minor overlap (<20%)',
    fail: 'Significant audience overlap (>30%)',
  },

  // Audience & Targeting (20% weight) - Sample checks
  {
    id: 'M19',
    check: 'Audience overlap',
    severity: 'high',
    category: 'Audience & Targeting',
    pass: '<20% overlap between active ad sets',
    warning: '20-40% overlap',
    fail: '>40% overlap between ad sets',
  },
  {
    id: 'M20',
    check: 'Custom Audience freshness',
    severity: 'high',
    category: 'Audience & Targeting',
    pass: 'Website Custom Audiences refreshed within 180 days',
    warning: '180-365 days old',
    fail: '>365 days old or not created',
  },
  {
    id: 'M23',
    check: 'Exclusion audiences',
    severity: 'high',
    category: 'Audience & Targeting',
    pass: 'Purchasers/converters excluded from prospecting',
    warning: 'Partial exclusions',
    fail: 'No purchaser exclusions from prospecting',
  },
];

export const metaAdsAudit: PlatformAudit = {
  platform: 'Meta Ads',
  totalChecks: 46,
  categories: metaAdsCategories,
  checks: metaAdsChecks,
};
