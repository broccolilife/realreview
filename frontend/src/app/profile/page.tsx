'use client';
import { useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { api } from '@/lib/api';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.me().then(setUser).catch(() => setError('Please sign in to view your profile.'));
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
      </div>

      <div className="space-y-3">
        {!user.is_verified && (
          <a href="/verify" className="block w-full text-center bg-gold-500 text-navy-950 py-3 rounded-xl font-medium hover:bg-gold-400 transition">
            Verify Your Address
          </a>
        )}
        <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/auth'; }}
          className="w-full text-center border border-navy-200 py-3 rounded-xl text-sm text-navy-500 hover:bg-navy-50 transition">
          Sign Out
        </button>
      </div>
    </div>
  );
}
