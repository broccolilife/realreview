'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { LeaderboardEntry, TIER_BADGES, TIER_LABELS } from '@/lib/types';

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getLeaderboard()
      .then(setEntries)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="max-w-lg mx-auto p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-navy-950">🏆 Leaderboard</h1>
        <p className="text-sm text-navy-500 mt-1">Top reviewers by Review Credits</p>
      </div>

      {entries.length === 0 ? (
        <p className="text-center text-navy-400">No reviewers yet. Be the first!</p>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => {
            const isTop3 = entry.rank <= 3;
            const rankEmoji = entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`;
            return (
              <div
                key={entry.rank}
                className={`flex items-center gap-3 rounded-xl p-3 ${
                  isTop3 ? 'bg-gradient-to-r from-gold-50 to-white border border-gold-200' : 'bg-navy-50'
                }`}
              >
                <span className={`text-lg font-bold w-10 text-center ${isTop3 ? 'text-2xl' : 'text-navy-400'}`}>
                  {rankEmoji}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-navy-950 truncate">{entry.username}</span>
                    <span title={TIER_LABELS[entry.tier]}>{TIER_BADGES[entry.tier]}</span>
                  </div>
                  <p className="text-xs text-navy-400">{entry.reviews_count} review{entry.reviews_count !== 1 ? 's' : ''}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-navy-950">💰 {entry.credits}</span>
                  <p className="text-xs text-navy-400">RC</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="text-center">
        <a href="/submit" className="inline-block bg-gold-500 text-navy-950 px-6 py-3 rounded-xl font-medium hover:bg-gold-400 transition">
          ✍️ Write a review to climb the ranks
        </a>
      </div>
    </div>
  );
}
