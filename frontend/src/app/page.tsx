'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import SearchBar from '@/components/SearchBar';
import BuildingCard from '@/components/BuildingCard';
import { Building } from '@/lib/types';
import { api } from '@/lib/api';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function Home() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selected, setSelected] = useState<Building | null>(null);

  useEffect(() => {
    api.getBuildings().then(setBuildings).catch(() => {});
  }, []);

  return (
    <div className="h-[calc(100vh-48px)] relative">
      {/* Search overlay */}
      <div className="absolute top-3 left-3 right-3 z-[500]">
        <SearchBar onSearch={(q) => console.log('search', q)} />
      </div>

      {/* Map */}
      <Map buildings={buildings} onBuildingClick={setSelected} />

      {/* Bottom card */}
      {selected && (
        <div className="absolute bottom-0 left-0 right-0 z-[500] p-3">
          <BuildingCard
            building={selected}
            onClick={() => window.location.href = `/building/${selected.id}`}
          />
        </div>
      )}

      {/* Empty state */}
      {buildings.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-[400] pointer-events-none">
          <div className="bg-white/90 rounded-2xl p-8 text-center max-w-sm pointer-events-auto">
            <div className="text-4xl mb-3">🏠</div>
            <h2 className="text-xl font-bold text-navy-950 mb-2">Welcome to RealReview</h2>
            <p className="text-sm text-navy-600 mb-4">
              Verified apartment reviews from real tenants. Be the first to contribute!
            </p>
            <a href="/verify" className="inline-block bg-gold-500 text-navy-950 px-6 py-2.5 rounded-xl font-medium hover:bg-gold-400 transition">
              Verify & Review
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
