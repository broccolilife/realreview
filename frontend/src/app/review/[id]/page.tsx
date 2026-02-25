'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ReviewCard from '@/components/ReviewCard';
import { Review, Comment } from '@/lib/types';
import { api } from '@/lib/api';

export default function ReviewPage() {
  const { id } = useParams();
  const [review, setReview] = useState<Review | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    // Fetch review via building endpoint (simplified for MVP)
    api.getComments(Number(id)).then(setComments).catch(() => {});
  }, [id]);

  const postComment = async () => {
    if (!newComment.trim()) return;
    try {
      const c = await api.createComment(Number(id), newComment);
      setComments([...comments, c]);
      setNewComment('');
    } catch {}
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-xl font-bold text-navy-950">Review #{id}</h1>

      {review && <ReviewCard review={review} />}

      <div>
        <h2 className="font-semibold mb-3">Comments</h2>
        <div className="space-y-2">
          {comments.map((c) => (
            <div key={c.id} className="bg-navy-50 rounded-xl p-3 text-sm">
              <p>{c.text}</p>
              <span className="text-xs text-navy-400">{new Date(c.created_at).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <input value={newComment} onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 p-2 border border-navy-200 rounded-xl text-sm" />
          <button onClick={postComment}
            className="bg-navy-950 text-white px-4 py-2 rounded-xl text-sm">Post</button>
        </div>
      </div>
    </div>
  );
}
