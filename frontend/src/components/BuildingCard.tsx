'use client';
import RatingStars from './RatingStars';
import { Building } from '@/lib/types';

interface Props {
  building: Building;
  onClick?: () => void;
}

export default function BuildingCard({ building, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
    >
      <h3 className="font-semibold text-navy-950 text-sm">{building.address}</h3>
      <p className="text-xs text-navy-500">{building.city}, {building.state} {building.zip}</p>
      <div className="flex items-center gap-2 mt-2">
        <RatingStars rating={Math.round(building.avg_rating)} size="sm" />
        <span className="text-xs text-navy-400">({building.review_count} reviews)</span>
      </div>
    </div>
  );
}
