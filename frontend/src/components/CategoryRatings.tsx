'use client';
import RatingStars from './RatingStars';

interface Props {
  ratings: Record<string, number>;
  categories?: string[];
  onRate?: (cat: string, n: number) => void;
}

export default function CategoryRatings({ ratings, categories, onRate }: Props) {
  const cats = categories || Object.keys(ratings).filter((k) => ratings[k] > 0);

  if (cats.length === 0) return <p className="text-sm text-navy-400">No category ratings yet.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {cats.map((cat) => (
        <div key={cat} className="flex items-center justify-between gap-2">
          <span className="text-sm text-navy-800">{cat}</span>
          <RatingStars
            rating={Math.round(ratings[cat] || 0)}
            onRate={onRate ? (n) => onRate(cat, n) : undefined}
            size="sm"
          />
        </div>
      ))}
    </div>
  );
}
