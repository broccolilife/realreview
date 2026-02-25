'use client';
import { useEffect, useRef } from 'react';
import { Building } from '@/lib/types';

interface Props {
  buildings: Building[];
  onBuildingClick: (b: Building) => void;
}

function getRatingColor(rating: number): string {
  if (rating >= 4) return '#22c55e';
  if (rating >= 3) return '#eab308';
  return '#ef4444';
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
        center: [34.05, -118.25], // LA default
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
    // Clear existing markers
    map.eachLayer((layer: any) => {
      if (layer instanceof L.MarkerClusterGroup || layer._isMarker) map.removeLayer(layer);
    });

    const cluster = (L as any).markerClusterGroup();

    blds.forEach((b) => {
      if (!b.lat || !b.lng) return;
      const color = getRatingColor(b.avg_rating);
      const icon = L.divIcon({
        className: 'custom-pin',
        html: `<div style="width:24px;height:24px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([b.lat, b.lng], { icon });
      marker._isMarker = true;
      marker.bindPopup(`
        <div style="min-width:180px;font-family:sans-serif;">
          <strong style="color:#0a0b3b;">${b.address}</strong><br/>
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

  return <div ref={mapRef} className="w-full h-full" />;
}
