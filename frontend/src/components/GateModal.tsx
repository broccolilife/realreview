'use client';

interface Props {
  onClose: () => void;
}

export default function GateModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 z-[2000] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center">
        <h2 className="text-xl font-bold text-navy-950 mb-2">Unlock Full Reviews</h2>
        <p className="text-sm text-navy-600 mb-6">
          To read detailed reviews, contribute to the community or subscribe.
        </p>
        <div className="space-y-3">
          <a
            href="/verify"
            className="block w-full bg-navy-950 text-white py-3 rounded-xl font-medium hover:bg-navy-800 transition"
          >
            ✅ Verify your address & review (free)
          </a>
          <button className="w-full bg-gold-500 text-navy-950 py-3 rounded-xl font-medium hover:bg-gold-400 transition">
            💳 Subscribe for $4.99/mo
          </button>
        </div>
        <button onClick={onClose} className="mt-4 text-sm text-navy-400 hover:underline">
          Maybe later
        </button>
      </div>
    </div>
  );
}
