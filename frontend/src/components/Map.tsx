'use client';
import { useEffect, useRef, useState } from 'react';
import { Building, ServiceType, SERVICE_TYPE_ICONS, SERVICE_TYPE_LABELS, SERVICE_TYPE_COLORS } from '@/lib/types';

interface Props {
  buildings: Building[];
  onBuildingClick: (b: Building) => void;
}

const ALL_TYPES: ServiceType[] = ['apartment', 'restaurant', 'hospital', 'school', 'workplace', 'gym', 'hotel'];

function getPinColor(building: Building): string {
  const st = (building.service_type || 'apartment') as ServiceType;
  return SERVICE_TYPE_COLORS[st] || '#6366f1';
}

export default function Map({ buildings, onBuildingClick }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);
  const [filter, setFilter] = useState<ServiceType | 'all'>('all');

  const filtered = filter === 'all' ? buildings : buildings.filter((b) => (b.service_type || 'apartment') === filter);

  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    const init = async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet.markercluster');

      const map = L.map(mapRef.current!, {
        center: [34.05, -118.25],
        zoom: 12,
        zoomControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      leafletMap.current = map;
      updateMarkers(L, map, filtered);
    };

    init();
  }, []);

  useEffect(() => {
    if (!leafletMap.current) return;
    const loadAndUpdate = async () => {
      const L = (await import('leaflet')).default;
      updateMarkers(L, leafletMap.current, filtered);
    };
    loadAndUpdate();
  }, [filtered]);

  const updateMarkers = (L: any, map: any, blds: Building[]) => {
    map.eachLayer((layer: any) => {
      if (layer instanceof L.MarkerClusterGroup || layer._isMarker) map.removeLayer(layer);
    });

    const cluster = (L as any).markerClusterGroup();

    blds.forEach((b) => {
      if (!b.lat || !b.lng) return;
      const color = getPinColor(b);
      const st = (b.service_type || 'apartment') as ServiceType;
      const icon = L.divIcon({
        className: 'custom-pin',
        html: `<div style="width:28px;height:28px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:14px;">${SERVICE_TYPE_ICONS[st]}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([b.lat, b.lng], { icon });
      marker._isMarker = true;
      marker.bindPopup(`
        <div style="min-width:180px;font-family:sans-serif;">
          <strong style="color:#0a0b3b;">${SERVICE_TYPE_ICONS[st]} ${b.address}</strong><br/>
          <span style="font-size:12px;color:#666;">${b.city}, ${b.state}</span><br/>
          <span style="color:${color};font-size:18px;">${'★'.repeat(Math.round(b.avg_rating))}${'☆'.repeat(5 - Math.round(b.avg_rating))}</span>
          <span style="font-size:12px;color:#888;"> (${b.review_count})</span><br/>
          <a href="/building/${b.id}" style="color:#c9a84c;font-size:12px;">View reviews →</a>
        </div>
      `);
      marker.on('click', () => onBuildingClick(b));
      cluster.addLayer(marker);
    });

    map.addLayer(cluster);
  };

  return (
    <div className="relative w-full h-full">
      {/* Service type filter bar */}
      <div className="absolute top-2 left-2 z-[1000] flex gap-1 bg-white/90 backdrop-blur rounded-xl p-1 shadow-md">
        <button onClick={() => setFilter('all')}
          className={`text-xs px-2 py-1 rounded-lg transition ${filter === 'all' ? 'bg-navy-950 text-white' : 'hover:bg-navy-100'}`}>
          All
        </button>
        {ALL_TYPES.map((t) => (
          <button key={t} onClick={() => setFilter(t)}
            className={`text-xs px-2 py-1 rounded-lg transition ${filter === t ? 'bg-navy-950 text-white' : 'hover:bg-navy-100'}`}
            title={SERVICE_TYPE_LABELS[t]}>
            {SERVICE_TYPE_ICONS[t]}
          </button>
        ))}
      </div>
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
