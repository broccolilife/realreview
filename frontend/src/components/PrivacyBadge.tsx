'use client';

export default function PrivacyBadge({ message }: { message?: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
      <span>🔒</span>
      <span>{message || 'Your lease is deleted after verification. We never store your documents.'}</span>
    </div>
  );
}
