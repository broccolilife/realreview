'use client';
import { useState, useEffect } from 'react';
import { User, CreditBalance, TIER_BADGES, TIER_LABELS } from '@/lib/types';
import { api } from '@/lib/api';

const TIER_ORDER = ['new_tenant', 'verified_renter', 'trusted_reviewer', 'community_pillar'];
const TIER_THRESHOLDS = [0, 10, 50, 200];

function TierProgress({ credits, tier, nextTier, creditsToNext, reviewsToNext }: {
  credits: number; tier: string; nextTier?: string; creditsToNext?: number; reviewsToNext?: number;
}) {
  const currentIdx = TIER_ORDER.indexOf(tier);
  const currentThreshold = TIER_THRESHOLDS[currentIdx] || 0;
  const nextThreshold = TIER_THRESHOLDS[currentIdx + 1] || TIER_THRESHOLDS[TIER_THRESHOLDS.length - 1];
  const progress = currentIdx >= TIER_ORDER.length - 1 ? 100 :
    Math.min(100, ((credits - currentThreshold) / (nextThreshold - currentThreshold)) * 100);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{TIER_BADGES[tier]} {TIER_LABELS[tier]}</span>
        {nextTier && <span className="text-navy-400">{TIER_BADGES[nextTier]} {TIER_LABELS[nextTier]}</span>}
      </div>
      <div className="h-3 bg-navy-100 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }} />
      </div>
      {nextTier && (
        <p className="text-xs text-navy-400">
          {creditsToNext ? `${creditsToNext} more RC` : ''}
          {creditsToNext && reviewsToNext ? ' and ' : ''}
          {reviewsToNext ? `${reviewsToNext} more review${reviewsToNext > 1 ? 's' : ''}` : ''}
          {' '}to reach {TIER_LABELS[nextTier]}
        </p>
      )}
    </div>
  );
}

const REASON_LABELS: Record<string, string> = {
  review_submitted: '✍️ Review submitted',
  photo_added: '📸 Photo added',
  helpful_comment: '💬 Helpful comment',
  referral: '🤝 Friend referred',
  streak_7_bonus: '🔥 7-day streak bonus',
  likes_5_bonus: '👍 5 likes bonus',
  likes_10_bonus: '❤️ 10 likes bonus',
  unlock_building: '🔓 Building unlocked',
  unlock_neighborhood: '🏘️ Neighborhood unlocked',
  unlock_unlimited_30d: '♾️ 30-day unlimited',
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState<CreditBalance | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.me().then(setUser).catch(() => setError('Please sign in to view your profile.'));
    api.getCreditsBalance().then(setBalance).catch(() => {});
  }, []);

  if (error) {
    return (
      <div className="max-w-sm mx-auto p-4 pt-12 text-center">
        <p className="text-navy-500 mb-4">{error}</p>
        <a href="/auth" className="text-gold-600 underline">Sign in</a>
      </div>
    );
  }

  if (!user) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="max-w-lg mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-navy-950">Your Profile</h1>

      {/* Credits Card */}
      {balance && (
        <div className="bg-gradient-to-br from-navy-950 to-navy-800 rounded-2xl p-5 text-white space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-navy-300">Review Credits</p>
              <p className="text-3xl font-bold">💰 {balance.credits} RC</p>
            </div>
            <div className="text-right">
              <p className="text-4xl">{TIER_BADGES[balance.tier]}</p>
              <p className="text-xs text-navy-300">{TIER_LABELS[balance.tier]}</p>
            </div>
          </div>
          {balance.login_streak >= 2 && (
            <p className="text-sm text-gold-400">🔥 {balance.login_streak} day streak!</p>
          )}
          <TierProgress
            credits={balance.credits}
            tier={balance.tier}
            nextTier={balance.next_tier ?? undefined}
            creditsToNext={balance.credits_to_next_tier ?? undefined}
            reviewsToNext={balance.reviews_to_next_tier ?? undefined}
          />
        </div>
      )}

      {/* Account Info */}
      <div className="bg-navy-50 rounded-xl p-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-navy-500">Email</span>
          <span className="text-sm font-medium">{user.email}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-navy-500">Verified</span>
          <span className="text-sm">{user.is_verified ? '✅ Yes' : '❌ Not yet'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-navy-500">Plan</span>
          <span className="text-sm capitalize">{user.subscription_tier}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-navy-500">Reviews</span>
          <span className="text-sm font-medium">{balance?.reviews_count ?? 0}</span>
        </div>
      </div>

      {/* Transaction History */}
      {balance && balance.transactions.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-navy-950">Transaction History</h2>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {balance.transactions.map((tx) => (
              <div key={tx.id} className="flex justify-between items-center bg-navy-50 rounded-lg px-3 py-2 text-sm">
                <span className="text-navy-700">{REASON_LABELS[tx.reason] || tx.reason}</span>
                <span className={`font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount} RC
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {!user.is_verified && (
          <a href="/verify" className="block w-full text-center bg-gold-500 text-navy-950 py-3 rounded-xl font-medium hover:bg-gold-400 transition">
            Verify Your Address
          </a>
        )}
        <a href="/leaderboard" className="block w-full text-center border border-navy-200 py-3 rounded-xl text-sm text-navy-700 hover:bg-navy-50 transition">
          🏆 View Leaderboard
        </a>
        <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/auth'; }}
          className="w-full text-center border border-navy-200 py-3 rounded-xl text-sm text-navy-500 hover:bg-navy-50 transition">
          Sign Out
        </button>
      </div>
    </div>
  );
}
