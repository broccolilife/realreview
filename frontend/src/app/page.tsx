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
  const [filters, setFilters] = useState({
    minRent: 500,
    maxRent: 5000,
    bedrooms: '' as string,
    petFriendly: '' as string,
    parking: '' as string,
    laundry: '' as string,
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    api.getBuildings().then(setBuildings).catch(() => {});
  }, []);

  return (
    <div className="h-[calc(100vh-48px)] relative">
      {/* Search overlay */}
      <div className="absolute top-3 left-3 right-3 z-[500]">
        <div className="flex gap-2 items-start">
          <SearchBar onSearch={(q) => console.log('search', q)} />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-white shadow-sm border border-navy-200 rounded-full px-3 py-2.5 text-sm hover:bg-navy-50 transition flex-shrink-0"
          >
            ⚙️ Filters
          </button>
        </div>

        {/* Apartment filters panel */}
        {showFilters && (
          <div className="mt-2 bg-white/95 backdrop-blur rounded-xl shadow-lg border border-navy-100 p-4 max-w-md space-y-4">
            <h3 className="font-semibold text-sm text-navy-950">Apartment Filters</h3>

            {/* Rent range */}
            <div>
              <label className="text-xs text-navy-600 block mb-1">
                Rent range: ${filters.minRent} – ${filters.maxRent}/mo
              </label>
              <div className="flex gap-2 items-center">
                <input type="range" min={500} max={5000} step={100}
                  value={filters.minRent}
                  onChange={(e) => setFilters({ ...filters, minRent: Number(e.target.value) })}
                  className="flex-1 accent-gold-500" />
                <input type="range" min={500} max={5000} step={100}
                  value={filters.maxRent}
                  onChange={(e) => setFilters({ ...filters, maxRent: Number(e.target.value) })}
                  className="flex-1 accent-gold-500" />
              </div>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="text-xs text-navy-600 block mb-1">Bedrooms</label>
              <div className="flex gap-1">
                {['Any', 'Studio', '1BR', '2BR', '3BR+'].map((opt) => (
                  <button key={opt}
                    onClick={() => setFilters({ ...filters, bedrooms: opt === 'Any' ? '' : opt })}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                      (filters.bedrooms === opt || (!filters.bedrooms && opt === 'Any'))
                        ? 'bg-navy-950 text-white border-navy-950' : 'border-navy-200 hover:border-navy-400'
                    }`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Pet-friendly */}
            <div className="flex gap-4">
              <div>
                <label className="text-xs text-navy-600 block mb-1">Pet-friendly</label>
                <div className="flex gap-1">
                  {['Any', 'Yes', 'No'].map((opt) => (
                    <button key={opt}
                      onClick={() => setFilters({ ...filters, petFriendly: opt === 'Any' ? '' : opt })}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                        (filters.petFriendly === opt || (!filters.petFriendly && opt === 'Any'))
                          ? 'bg-navy-950 text-white border-navy-950' : 'border-navy-200 hover:border-navy-400'
                      }`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-navy-600 block mb-1">Parking</label>
                <div className="flex gap-1">
                  {['Any', 'Yes', 'No'].map((opt) => (
                    <button key={opt}
                      onClick={() => setFilters({ ...filters, parking: opt === 'Any' ? '' : opt })}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                        (filters.parking === opt || (!filters.parking && opt === 'Any'))
                          ? 'bg-navy-950 text-white border-navy-950' : 'border-navy-200 hover:border-navy-400'
                      }`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Laundry */}
            <div>
              <label className="text-xs text-navy-600 block mb-1">Laundry</label>
              <div className="flex gap-1">
                {['Any', 'In-unit', 'In-building', 'None'].map((opt) => (
                  <button key={opt}
                    onClick={() => setFilters({ ...filters, laundry: opt === 'Any' ? '' : opt })}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                      (filters.laundry === opt || (!filters.laundry && opt === 'Any'))
                        ? 'bg-navy-950 text-white border-navy-950' : 'border-navy-200 hover:border-navy-400'
                    }`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
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
            <h2 className="text-xl font-bold text-navy-950 mb-2">Verified apartment reviews from real tenants</h2>
            <p className="text-sm text-navy-600 mb-4">
              Every review is from someone who proved they lived there. No fake reviews. No landlord astroturfing.
            </p>
            <a href="/verify" className="inline-block bg-gold-500 text-navy-950 px-6 py-2.5 rounded-xl font-medium hover:bg-gold-400 transition">
              Verify Your Apartment & Review
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
