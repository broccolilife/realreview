'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ReviewForm from '@/components/ReviewForm';
import PrivacyBadge from '@/components/PrivacyBadge';
import { api } from '@/lib/api';

function SubmitInner() {
  const params = useSearchParams();
  const buildingId = Number(params.get('building') || 0);

  const handleSubmit = async (data: any) => {
    try {
      await api.createReview(data);
      alert('Review submitted! Thank you for helping fellow tenants.');
      window.location.href = `/building/${buildingId}`;
    } catch (e: any) {
      alert(e.message || 'Failed to submit review');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-950">Review Your Apartment</h1>
        <p className="text-sm text-navy-500 mt-1">Share your honest experience to help other tenants.</p>
      </div>

      {buildingId ? (
        <ReviewForm buildingId={buildingId} onSubmit={handleSubmit} />
      ) : (
        <div className="text-center py-8">
          <p className="text-navy-500">First, <a href="/verify" className="text-gold-600 underline">verify your apartment</a> to start reviewing.</p>
        </div>
      )}

      <PrivacyBadge message="Your review is anonymous. Your lease is deleted after verification." />
    </div>
  );
}

export default function SubmitPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
      <SubmitInner />
    </Suspense>
  );
}
