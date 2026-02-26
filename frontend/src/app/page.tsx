'use client';
import { useState, useEffect, useRef } from 'react';
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
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.getBuildings().then(setBuildings).catch(() => {});
  }, []);

  const scrollToMap = () => {
    mapRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* ===================== HERO SECTION ===================== */}
      <section className="bg-navy-950 text-white py-20 px-6 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Real reviews. From real people.{' '}
            <span className="text-gold-400">Who actually lived there.</span>
          </h1>
          <p className="text-lg md:text-xl text-navy-300 max-w-2xl mx-auto mb-10">
            No bots. No paid reviews. No fake 5-stars from landlords. No fake 1-stars from competitors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/verify"
              className="bg-gold-500 text-navy-950 px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-gold-400 transition shadow-lg"
            >
              Leave Your First Review →
            </a>
            <button
              onClick={scrollToMap}
              className="border border-white/30 text-white px-8 py-3.5 rounded-xl font-medium text-lg hover:bg-white/10 transition"
            >
              Explore the Map
            </button>
          </div>
          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-navy-400">
            <span>🔒 Privacy-first</span>
            <span>📄 Documents deleted after verification</span>
            <span>👤 Fully anonymous reviews</span>
          </div>
        </div>
      </section>

      {/* ===================== MISSION STATEMENT ===================== */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-navy-950 mb-8">
            Why we built this.
          </h2>
          <div className="space-y-6 text-lg text-navy-700 leading-relaxed">
            <p>
              You&apos;ve seen it. Five-star reviews that feel like they were written by a robot.
              One-star reviews that feel like revenge. Paid-for reviews that artificially promote.
              Bot-generated fake reviews that defame.
            </p>
            <p>
              You read 50 reviews and still don&apos;t know if the apartment is any good.
            </p>
            <p className="text-2xl font-bold text-navy-950">
              We&apos;re done with that.
            </p>
            <p>
              RealReview exists for one reason:{' '}
              <strong className="text-navy-950">
                human reviews only, from people who are justified to review.
              </strong>{' '}
              If you didn&apos;t live there, you don&apos;t get to review it. Period.
            </p>
          </div>
        </div>
      </section>

      {/* ===================== THREE PILLARS ===================== */}
      <section className="bg-navy-50 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-navy-950 text-center mb-14">
            How we keep it real.
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="bg-white rounded-2xl p-8 border border-gold-200 shadow-sm hover:shadow-md transition">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-xl font-bold text-navy-950 mb-3">Proof of Residence</h3>
              <p className="text-navy-600 leading-relaxed">
                Upload your lease or rent receipt. Our system verifies you lived there, then deletes
                your document immediately. No name stored. No document kept. Just proof you&apos;re real.
              </p>
            </div>
            {/* Pillar 2 */}
            <div className="bg-white rounded-2xl p-8 border border-gold-200 shadow-sm hover:shadow-md transition">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-navy-950 mb-3">Bot Detection</h3>
              <p className="text-navy-600 leading-relaxed">
                We actively detect and block bot-generated reviews, copy-paste patterns, and
                coordinated fake review campaigns. If it doesn&apos;t smell human, it doesn&apos;t get published.
              </p>
            </div>
            {/* Pillar 3 */}
            <div className="bg-white rounded-2xl p-8 border border-gold-200 shadow-sm hover:shadow-md transition">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-navy-950 mb-3">We Build This Together</h3>
              <p className="text-navy-600 leading-relaxed">
                This is a community, not a product. You contribute a review, you get to read reviews.
                Give and take. The more honest people join, the better it gets for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== HONEST PROMISE ===================== */}
      <section className="bg-amber-50/50 py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-navy-950 mb-8">
            A promise from us to you.
          </h2>
          <div className="space-y-6 text-lg text-navy-700 leading-relaxed italic">
            <p>
              I know there won&apos;t be many reviews at first. That&apos;s okay.
              Every community starts somewhere.
            </p>
            <p>
              What I promise you: the algorithm will get better. The community will grow.
              And every single review you read here will be from someone who actually lived
              in that apartment.
            </p>
            <p>
              We&apos;re not trying to be the biggest.
              We&apos;re trying to be the most trusted.
            </p>
          </div>
          <p className="text-2xl font-bold text-navy-950 mt-10 mb-8 not-italic">
            Help us build something real.
          </p>
          <a
            href="/verify"
            className="inline-block bg-gold-500 text-navy-950 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gold-400 transition shadow-lg"
          >
            Leave Your First Review →
          </a>
        </div>
      </section>

      {/* ===================== MAP SECTION ===================== */}
      <section ref={mapRef} className="relative h-[calc(100vh-48px)]">
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

              {/* Pet-friendly & Parking */}
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
      </section>
    </div>
  );
}
