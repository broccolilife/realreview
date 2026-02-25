'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import { AccessInfo, TIER_BADGES, TIER_LABELS } from '@/lib/types';

interface Props {
  onClose: () => void;
  buildingId?: number;
  accessInfo?: AccessInfo | null;
  onUnlocked?: () => void;
}

export default function GateModal({ onClose, buildingId, accessInfo, onUnlocked }: Props) {
  const [unlocking, setUnlocking] = useState(false);
  const [error, setError] = useState('');

  const credits = accessInfo?.credits ?? 0;
  const cost = accessInfo?.cost_to_unlock ?? 2;
  const canAfford = credits >= cost;
  const tier = accessInfo?.tier ?? 'new_tenant';

  const handleUnlock = async () => {
    if (!buildingId) return;
    setUnlocking(true);
    setError('');
    try {
      await api.unlockBuilding(buildingId);
      onUnlocked?.();
      onClose();
    } catch (e: any) {
      setError(e.message || 'Failed to unlock');
    } finally {
      setUnlocking(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[2000] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center">
        <h2 className="text-xl font-bold text-navy-950 mb-2">Unlock Full Reviews</h2>
        
        <div className="bg-navy-50 rounded-xl p-3 mb-4 text-sm">
          <span>{TIER_BADGES[tier]} {TIER_LABELS[tier]}</span>
          <span className="mx-2">•</span>
          <span className="font-semibold">💰 {credits} RC</span>
        </div>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <div className="space-y-3">
          {canAfford && buildingId && (
            <button
              onClick={handleUnlock}
              disabled={unlocking}
              className="block w-full bg-navy-950 text-white py-3 rounded-xl font-medium hover:bg-navy-800 transition disabled:opacity-50"
            >
              {unlocking ? 'Unlocking...' : `🔓 Spend ${cost} RC to unlock`}
            </button>
          )}
          
          {!canAfford && (
            <div className="bg-gold-50 rounded-xl p-3 text-sm text-navy-700">
              You need {cost - credits} more RC. Write a review to earn 10!
            </div>
          )}

          <a
            href="/submit"
            className="block w-full bg-gold-500 text-navy-950 py-3 rounded-xl font-medium hover:bg-gold-400 transition"
          >
            ✍️ Write a review → earn 10 RC
          </a>

          <a
            href="/verify"
            className="block w-full border border-navy-200 text-navy-700 py-3 rounded-xl font-medium hover:bg-navy-50 transition"
          >
            ✅ Verify your apartment (free)
          </a>

          <button className="w-full bg-gradient-to-r from-gold-500 to-gold-400 text-navy-950 py-3 rounded-xl font-medium hover:opacity-90 transition">
            💳 Subscribe $4.99/mo — unlimited access
          </button>
        </div>

        <button onClick={onClose} className="mt-4 text-sm text-navy-400 hover:underline">
          Maybe later
        </button>
      </div>
    </div>
  );
}
