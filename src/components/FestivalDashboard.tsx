"use client";

import React, { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { FestivalItem } from "@/types/festival";
import Header from "./Header";
import FilterSection from "./FilterSection";
import FestivalCard from "./FestivalCard";
import FestivalDetail from "./FestivalDetail";
import { Map as MapIcon, List as ListIcon, Info, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Dynamic import Leaflet map to prevent SSR window error
const FestivalMap = dynamic(() => import("./FestivalMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full min-h-[400px] items-center justify-center bg-slate-950/40 rounded-2xl border border-slate-800 backdrop-blur-md">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        <p className="text-sm text-slate-400">부산 축제 지도를 불러오는 중...</p>
      </div>
    </div>
  ),
});

// Helper to extract active months for a festival
function getActiveMonths(item: FestivalItem): number[] {
  const text = `${item.USAGE_DAY_WEEK_AND_TIME} ${item.USAGE_DAY} ${item.ITEMCNTNTS}`;
  const months: number[] = [];
  
  for (let m = 1; m <= 12; m++) {
    // Search patterns like: "5월", "5.", "5 /"
    const pattern = new RegExp(`(${m}월|\\b${m}\\.)`);
    if (pattern.test(text)) {
      months.push(m);
    }
  }
  
  // Hardcoded month matching fallbacks if name parsing fails but dates suggest it
  if (months.length === 0) {
    if (item.MAIN_TITLE.includes("바다축제") || text.includes("8.")) months.push(8);
    if (item.MAIN_TITLE.includes("수국축제") || text.includes("7.")) months.push(7);
    if (item.MAIN_TITLE.includes("맥주축제") || text.includes("5.")) months.push(5);
    if (item.MAIN_TITLE.includes("금정산성") || text.includes("6.")) months.push(6);
    if (item.MAIN_TITLE.includes("불꽃축제") || text.includes("11.")) months.push(11);
    if (item.MAIN_TITLE.includes("연등축제") || text.includes("5.")) months.push(5);
    if (item.MAIN_TITLE.includes("모래축제") || text.includes("5.")) months.push(5);
    if (item.MAIN_TITLE.includes("동래읍성") || text.includes("10.")) months.push(10);
    if (item.MAIN_TITLE.includes("항축제") || text.includes("6.")) months.push(6);
    if (item.MAIN_TITLE.includes("구포나루") || text.includes("9.")) months.push(9);
  }
  
  return months;
}

interface FestivalDashboardProps {
  initialFestivals: FestivalItem[];
}

export default function FestivalDashboard({ initialFestivals }: FestivalDashboardProps) {
  // Filters & State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGugun, setSelectedGugun] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedFestival, setSelectedFestival] = useState<FestivalItem | null>(null);

  // Map view state (defaults to center of Busan)
  const defaultCenter: [number, number] = [35.179554, 129.075641];
  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultCenter);
  const [mapZoom, setMapZoom] = useState(11);

  // Mobile layout state: "list" tab or "map" tab
  const [activeMobileTab, setActiveMobileTab] = useState<"list" | "map">("list");

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedGugun("");
    setSelectedMonth("");
  };

  // Extract unique Guguns for filter
  const guguns = useMemo(() => {
    const set = new Set(initialFestivals.map((f) => f.GUGUN_NM).filter(Boolean));
    return Array.from(set).sort();
  }, [initialFestivals]);

  // Months lists (1 to 12)
  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => String(i + 1));
  }, []);

  // Filtered festivals
  const filteredFestivals = useMemo(() => {
    return initialFestivals.filter((festival) => {
      // 1. Search Query
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        festival.MAIN_TITLE.toLowerCase().includes(q) ||
        festival.GUGUN_NM.toLowerCase().includes(q) ||
        (festival.TITLE && festival.TITLE.toLowerCase().includes(q)) ||
        (festival.ITEMCNTNTS && festival.ITEMCNTNTS.toLowerCase().includes(q)) ||
        festival.PLACE.toLowerCase().includes(q);

      // 2. Gugun
      const matchesGugun = !selectedGugun || festival.GUGUN_NM === selectedGugun;

      // 3. Month
      let matchesMonth = true;
      if (selectedMonth) {
        const activeM = getActiveMonths(festival);
        matchesMonth = activeM.includes(Number(selectedMonth));
      }

      return matchesSearch && matchesGugun && matchesMonth;
    });
  }, [initialFestivals, searchQuery, selectedGugun, selectedMonth]);

  // When a user selects a card, center map on that festival coordinates
  const handleFestivalSelect = (festival: FestivalItem) => {
    setSelectedFestival(festival);
    setMapCenter([festival.LAT, festival.LNG]);
    setMapZoom(14);
  };

  // Force map focus on a festival from modal info list
  const handleFocusOnMap = (festival: FestivalItem) => {
    setMapCenter([festival.LAT, festival.LNG]);
    setMapZoom(14);
    // Switch to map view tab if on mobile
    setActiveMobileTab("map");
  };

  return (
    <div className="flex flex-1 flex-col bg-[#070b14] text-slate-100 min-h-screen">
      {/* Header */}
      <Header totalCount={initialFestivals.length} />

      {/* Main Container */}
      <main className="mx-auto flex-1 w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6 flex flex-col">
        {/* Filters */}
        <FilterSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedGugun={selectedGugun}
          setSelectedGugun={setSelectedGugun}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          guguns={guguns}
          months={months}
          onReset={handleResetFilters}
        />

        {/* Mobile Tab Control (Visible only on mobile/tablet) */}
        <div className="flex rounded-xl bg-slate-900/60 p-1 border border-slate-800 md:hidden">
          <button
            onClick={() => setActiveMobileTab("list")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold tracking-wide transition-all ${
              activeMobileTab === "list"
                ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <ListIcon className="h-4 w-4" />
            축제 목록 ({filteredFestivals.length})
          </button>
          <button
            onClick={() => setActiveMobileTab("map")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold tracking-wide transition-all ${
              activeMobileTab === "map"
                ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <MapIcon className="h-4 w-4" />
            지도로 보기
          </button>
        </div>

        {/* Responsive Grid Panel (Side-by-side on desktop) */}
        <div className="grid flex-1 grid-cols-1 md:grid-cols-12 gap-6 min-h-[500px]">
          {/* Left panel: Cards grid (scrollable list) */}
          <div
            className={`md:col-span-5 lg:col-span-5 flex flex-col space-y-4 ${
              activeMobileTab === "list" ? "block" : "hidden md:block"
            }`}
          >
            {/* Search counts */}
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>검색 결과 {filteredFestivals.length}건</span>
              {filteredFestivals.length === 0 && (
                <span className="text-pink-400">조건에 부합하는 축제가 없습니다.</span>
              )}
            </div>

            {/* Scrollable list */}
            <div className="flex-1 md:overflow-y-auto md:max-h-[calc(100vh-290px)] pr-1 pb-16 md:pb-4 space-y-4 scroll-smooth">
              <AnimatePresence mode="popLayout">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
                  {filteredFestivals.map((festival) => (
                    <FestivalCard
                      key={festival.UC_SEQ}
                      festival={festival}
                      onClick={() => handleFestivalSelect(festival)}
                    />
                  ))}
                </div>
              </AnimatePresence>

              {filteredFestivals.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/20 p-6">
                  <HelpCircle className="h-10 w-10 text-slate-600 animate-bounce mb-3" />
                  <h3 className="text-sm font-bold text-slate-300">검색 조건에 맞는 축제가 없습니다</h3>
                  <p className="mt-1 text-xs text-slate-500 max-w-xs">
                    다른 키워드를 검색하거나 필터 옵션을 변경해보세요.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-4 rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white transition-all"
                  >
                    필터 초기화
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right panel: Map component (sticky) */}
          <div
            className={`md:col-span-7 lg:col-span-7 h-[50vh] md:h-[calc(100vh-250px)] sticky top-[80px] ${
              activeMobileTab === "map" ? "block" : "hidden md:block"
            }`}
          >
            <FestivalMap
              festivals={filteredFestivals}
              center={mapCenter}
              zoom={mapZoom}
              selectedId={selectedFestival?.UC_SEQ || null}
              onMarkerClick={(festival) => setSelectedFestival(festival)}
            />
          </div>
        </div>
      </main>

      {/* Details modal overlay */}
      <FestivalDetail
        festival={selectedFestival}
        onClose={() => setSelectedFestival(null)}
        onShowOnMap={() => selectedFestival && handleFocusOnMap(selectedFestival)}
      />
    </div>
  );
}
