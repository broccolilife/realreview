'use client';

interface Props {
  rating: number;
  onRate?: (n: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function RatingStars({ rating, onRate, size = 'md' }: Props) {
  const sz = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-lg';
  return (
    <div className={`flex gap-0.5 ${sz}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onRate?.(n)}
          className={`${onRate ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          disabled={!onRate}
        >
          <span className={n <= rating ? 'text-gold-500' : 'text-gray-300'}>★</span>
        </button>
      ))}
    </div>
  );
}
