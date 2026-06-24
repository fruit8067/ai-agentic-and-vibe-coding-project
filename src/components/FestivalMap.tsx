"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { FestivalItem } from "@/types/festival";
import { cleanTitle } from "@/utils/api";
import { Calendar, Navigation, MapPin } from "lucide-react";

interface FestivalMapProps {
  festivals: FestivalItem[];
  center: [number, number];
  zoom: number;
  selectedId: number | null;
  onMarkerClick: (festival: FestivalItem) => void;
}

// Helper component to update map view when center/zoom props change
function ChangeMapView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 0.75 });
  }, [center, zoom, map]);
  return null;
}

export default function FestivalMap({
  festivals,
  center,
  zoom,
  selectedId,
  onMarkerClick,
}: FestivalMapProps) {
  // Create beautiful custom div-icons for markers
  const getMarkerIcon = (id: number) => {
    const isSelected = selectedId === id;
    
    return L.divIcon({
      className: "custom-leaflet-marker",
      html: `
        <div class="relative flex items-center justify-center w-8 h-8">
          <div class="absolute inset-0 rounded-full ${isSelected ? "bg-rose-500/40 animate-ping" : "bg-cyan-500/30 animate-pulse"}"></div>
          <div class="relative w-4 h-4 rounded-full border-2 border-slate-950 shadow-lg ${isSelected ? "bg-rose-500" : "bg-cyan-500"} flex items-center justify-center">
            <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -10],
    });
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-xl">
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={true}
        className="h-full w-full"
      >
        {/* OpenStreetMap dark-themed tiles (applied via CSS filter in globals.css) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ChangeMapView center={center} zoom={zoom} />

        {festivals.map((festival) => (
          <Marker
            key={festival.UC_SEQ}
            position={[festival.LAT, festival.LNG]}
            icon={getMarkerIcon(festival.UC_SEQ)}
            eventHandlers={{
              click: () => onMarkerClick(festival),
            }}
          >
            <Popup>
              <div className="p-1 space-y-1.5 max-w-[200px]">
                <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                  {festival.GUGUN_NM}
                </div>
                <h4 className="text-xs font-bold text-white leading-tight">
                  {festival.MAIN_TITLE}
                </h4>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <Calendar className="h-3 w-3 text-blue-500" />
                  <span>
                    {festival.USAGE_DAY_WEEK_AND_TIME?.split("~")[0] || festival.USAGE_DAY || "일정 미정"}
                  </span>
                </div>
                <button
                  onClick={() => onMarkerClick(festival)}
                  className="mt-1 flex w-full items-center justify-center gap-1 rounded bg-blue-600/80 hover:bg-blue-600 py-1 text-[9px] font-bold text-white transition-colors"
                >
                  <MapPin className="h-2.5 w-2.5" />
                  상세정보 보기
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
