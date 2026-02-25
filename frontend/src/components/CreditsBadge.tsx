'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { TIER_BADGES } from '@/lib/types';

export default function CreditsBadge() {
  const [credits, setCredits] = useState<number | null>(null);
  const [tier, setTier] = useState('new_tenant');
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    api.getCreditsBalance()
      .then((data) => {
        setCredits(data.credits);
        setTier(data.tier);
        setStreak(data.login_streak);
      })
      .catch(() => {});
    
    // Daily login on app open
    api.dailyLogin().catch(() => {});
  }, []);

  if (credits === null) return null;

  return (
    <div className="flex items-center gap-2 text-sm">
      {streak >= 2 && <span title={`${streak} day streak`}>🔥{streak}</span>}
      <span>{TIER_BADGES[tier] || '🥉'}</span>
      <a href="/profile" className="hover:text-gold-400">💰 {credits} RC</a>
    </div>
  );
}
