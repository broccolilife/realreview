'use client';
import { useEffect, useRef } from 'react';
import { Building } from '@/lib/types';

interface Props {
  buildings: Building[];
  onBuildingClick: (b: Building) => void;
}

export default function Map({ buildings, onBuildingClick }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);

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
      updateMarkers(L, map, buildings);
    };

    init();
  }, []);

  useEffect(() => {
    if (!leafletMap.current) return;
    const loadAndUpdate = async () => {
      const L = (await import('leaflet')).default;
      updateMarkers(L, leafletMap.current, buildings);
    };
    loadAndUpdate();
  }, [buildings]);

  const updateMarkers = (L: any, map: any, blds: Building[]) => {
    map.eachLayer((layer: any) => {
      if (layer instanceof L.MarkerClusterGroup || layer._isMarker) map.removeLayer(layer);
    });

    const cluster = (L as any).markerClusterGroup();
    const color = '#6366f1';

    blds.forEach((b) => {
      if (!b.lat || !b.lng) return;
      const icon = L.divIcon({
        className: 'custom-pin',
        html: `<div style="width:28px;height:28px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:14px;">🏠</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([b.lat, b.lng], { icon });
      marker._isMarker = true;
      marker.bindPopup(`
        <div style="min-width:180px;font-family:sans-serif;">
          <strong style="color:#0a0b3b;">🏠 ${b.address}</strong><br/>
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
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
