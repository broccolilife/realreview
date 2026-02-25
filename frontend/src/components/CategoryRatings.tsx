'use client';
import RatingStars from './RatingStars';
import { CATEGORIES } from '@/lib/types';

interface Props {
  ratings: Record<string, number>;
  onRate?: (cat: string, n: number) => void;
}

export default function CategoryRatings({ ratings, onRate }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {CATEGORIES.map((cat) => (
        <div key={cat} className="flex items-center justify-between gap-2">
          <span className="capitalize text-sm text-navy-800">{cat}</span>
          <RatingStars
            rating={ratings[cat] || 0}
            onRate={onRate ? (n) => onRate(cat, n) : undefined}
            size="sm"
          />
        </div>
      ))}
    </div>
  );
}
