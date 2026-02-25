'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ReviewCard from '@/components/ReviewCard';
import CategoryRatings from '@/components/CategoryRatings';
import GateModal from '@/components/GateModal';
import RatingStars from '@/components/RatingStars';
import { Building, Review, ServiceTypeData, SERVICE_TYPE_ICONS, SERVICE_TYPE_LABELS } from '@/lib/types';
import { api } from '@/lib/api';

export default function BuildingPage() {
  const { id } = useParams();
  const [building, setBuilding] = useState<Building | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [gated, setGated] = useState(true);
  const [showGate, setShowGate] = useState(false);
  const [typeData, setTypeData] = useState<ServiceTypeData | null>(null);

  useEffect(() => {
    api.getBuilding(Number(id)).then((data) => {
      setBuilding(data.building);
      setReviews(data.reviews);
      setGated(data.gated);
      const st = data.building.service_type || 'apartment';
      api.getCategoriesForType(st).then(setTypeData).catch(() => {});
    }).catch(() => {});
  }, [id]);

  if (!building) return <div className="p-6 text-center">Loading...</div>;

  const st = building.service_type || 'apartment';
  const avgCats = building.category_averages || {};

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">{SERVICE_TYPE_ICONS[st]}</span>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-navy-100 text-navy-600">
            {SERVICE_TYPE_LABELS[st]}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-navy-950">{building.address}</h1>
        <p className="text-navy-500">{building.city}, {building.state} {building.zip}</p>
        <div className="flex items-center gap-2 mt-2">
          <RatingStars rating={Math.round(building.avg_rating)} />
          <span className="text-sm text-navy-400">{building.avg_rating.toFixed(1)} ({building.review_count} reviews)</span>
        </div>
      </div>

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
          <p className="text-center text-navy-400 py-8">No reviews yet. Be the first!</p>
        )}
      </div>

      {showGate && <GateModal onClose={() => setShowGate(false)} />}
    </div>
  );
}
