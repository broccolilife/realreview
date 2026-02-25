'use client';
import DocumentUpload from '@/components/DocumentUpload';
import PrivacyBadge from '@/components/PrivacyBadge';
import { api } from '@/lib/api';

export default function VerifyPage() {
  const handleUpload = async (file: File) => {
    const result = await api.uploadDocument(file);
    if (result.building_id) {
      setTimeout(() => {
        window.location.href = `/submit?building=${result.building_id}`;
      }, 2000);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-950">Verify Your Address</h1>
        <p className="text-sm text-navy-500 mt-1">
          Upload a document proving you lived at an address. We&apos;ll verify it and you&apos;ll get full access.
        </p>
      </div>

      <DocumentUpload onUpload={handleUpload} />

      <div className="bg-navy-50 rounded-xl p-4 text-sm space-y-2">
        <h3 className="font-semibold text-navy-800">Accepted Documents</h3>
        <ul className="text-navy-600 space-y-1">
          <li>📋 Lease or rental agreement</li>
          <li>🧾 Rent receipt or payment confirmation</li>
          <li>💡 Utility bill (electric, gas, water, internet)</li>
        </ul>
      </div>

      <PrivacyBadge />
    </div>
  );
}
