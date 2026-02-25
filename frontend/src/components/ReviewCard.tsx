'use client';
import RatingStars from './RatingStars';
import { Review } from '@/lib/types';

interface Props {
  review: Review;
  blurred?: boolean;
}

export default function ReviewCard({ review, blurred }: Props) {
  return (
    <div className={`border border-navy-100 rounded-xl p-4 ${blurred ? 'review-blur' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <RatingStars rating={review.overall_rating} size="sm" />
        <span className="text-xs text-navy-400">
          {new Date(review.created_at).toLocaleDateString()}
        </span>
      </div>
      {review.pros.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {review.pros.map((p) => (
            <span key={p} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">✓ {p}</span>
          ))}
        </div>
      )}
      {review.cons.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {review.cons.map((c) => (
            <span key={c} className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full">✗ {c}</span>
          ))}
        </div>
      )}
      {review.text && <p className="text-sm text-navy-800 mb-2">{review.text}</p>}
      <div className="flex items-center gap-4 text-xs text-navy-400">
        {review.rent_paid && <span>${review.rent_paid}/mo</span>}
        {review.would_renew !== null && review.would_renew !== undefined && (
          <span>{review.would_renew ? '✅ Would renew' : '❌ Would not renew'}</span>
        )}
        <span>❤️ {review.likes_count}</span>
      </div>
    </div>
  );
}
