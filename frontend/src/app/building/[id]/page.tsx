'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ReviewCard from '@/components/ReviewCard';
import CategoryRatings from '@/components/CategoryRatings';
import GateModal from '@/components/GateModal';
import RatingStars from '@/components/RatingStars';
import { Building, Review, ServiceTypeData, AccessInfo } from '@/lib/types';
import { api } from '@/lib/api';

export default function BuildingPage() {
  const { id } = useParams();
  const [building, setBuilding] = useState<Building | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [gated, setGated] = useState(true);
  const [showGate, setShowGate] = useState(false);
  const [accessInfo, setAccessInfo] = useState<AccessInfo | null>(null);
  const [typeData, setTypeData] = useState<ServiceTypeData | null>(null);

  useEffect(() => {
    api.getBuilding(Number(id)).then((data) => {
      setBuilding(data.building);
      setReviews(data.reviews);
      setGated(data.gated);
      setAccessInfo(data.access_info || null);
      api.getCategoriesForType('apartment').then(setTypeData).catch(() => {});
    }).catch(() => {});
  }, [id]);

  if (!building) return <div className="p-6 text-center">Loading...</div>;

  const avgCats = building.category_averages || {};

  // Compute building summary stats from reviews
  const rentsReported = reviews.filter((r) => r.rent_paid).map((r) => r.rent_paid!);
  const avgRent = rentsReported.length > 0
    ? Math.round(rentsReported.reduce((a, b) => a + b, 0) / rentsReported.length)
    : null;
  const renewalVotes = reviews.filter((r) => r.would_renew !== null && r.would_renew !== undefined);
  const renewalRate = renewalVotes.length > 0
    ? Math.round((renewalVotes.filter((r) => r.would_renew).length / renewalVotes.length) * 100)
    : null;
  const rentIncreaseReports = reviews.filter((r) => r.optional_fields?.rent_increased === true).length;

  // Most common complaints (top con tags)
  const conCounts: Record<string, number> = {};
  reviews.forEach((r) => (r.cons || []).forEach((c) => { conCounts[c] = (conCounts[c] || 0) + 1; }));
  const topComplaints = Object.entries(conCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">🏠</span>
        </div>
        <h1 className="text-2xl font-bold text-navy-950">{building.address}</h1>
        <p className="text-navy-500">{building.city}, {building.state} {building.zip}</p>
        <div className="flex items-center gap-2 mt-2">
          <RatingStars rating={Math.round(building.avg_rating)} />
          <span className="text-sm text-navy-400">{building.avg_rating.toFixed(1)} ({building.review_count} reviews)</span>
        </div>
      </div>

      {/* Building Summary Stats */}
      {(avgRent || renewalRate !== null || topComplaints.length > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {avgRent && (
            <div className="bg-indigo-50 rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-indigo-700">${avgRent}</div>
              <div className="text-xs text-indigo-500">Avg. Rent/mo</div>
            </div>
          )}
          {renewalRate !== null && (
            <div className="bg-emerald-50 rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-emerald-700">{renewalRate}%</div>
              <div className="text-xs text-emerald-500">Would Renew</div>
            </div>
          )}
          {rentIncreaseReports > 0 && (
            <div className="bg-red-50 rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-red-700">{rentIncreaseReports}</div>
              <div className="text-xs text-red-500">Rent Increase Reports</div>
            </div>
          )}
          {topComplaints.length > 0 && (
            <div className="bg-amber-50 rounded-xl p-3">
              <div className="text-xs text-amber-600 font-medium mb-1">Top Complaints</div>
              {topComplaints.map(([tag, count]) => (
                <div key={tag} className="text-xs text-amber-800">{tag} ({count})</div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="bg-navy-50 rounded-xl p-4">
        <h2 className="font-semibold mb-3">Category Breakdown</h2>
        <CategoryRatings ratings={avgCats} categories={typeData?.categories} />
      </div>

      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">Reviews</h2>
        <a href={`/submit?building=${building.id}`}
          className="text-sm bg-gold-500 text-navy-950 px-4 py-2 rounded-xl font-medium hover:bg-gold-400 transition">
          Leave a Review
        </a>
      </div>

      <div className="space-y-3">
        {reviews.map((r, i) => (
          <div key={r.id} onClick={() => gated && i > 0 && setShowGate(true)}>
            <ReviewCard review={r} blurred={gated && i > 0} />
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="text-center text-navy-400 py-8">No reviews yet. Be the first tenant to share your experience!</p>
        )}
      </div>

      {showGate && (
        <GateModal
          onClose={() => setShowGate(false)}
          buildingId={building.id}
          accessInfo={accessInfo}
          onUnlocked={() => {
            setGated(false);
            setShowGate(false);
          }}
        />
      )}
    </div>
  );
}
