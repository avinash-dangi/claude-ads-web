'use client';

import SpeedAudit from '@/components/audit/SpeedAudit';

export default function AuditPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/30 py-12">
      <div className="container mx-auto px-4">
        <SpeedAudit />
      </div>
    </div>
  );
}
