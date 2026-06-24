"use client";

import React from "react";
import { Search, MapPin, Calendar, RotateCcw } from "lucide-react";

interface FilterSectionProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedGugun: string;
  setSelectedGugun: (g: string) => void;
  selectedMonth: string;
  setSelectedMonth: (m: string) => void;
  guguns: string[];
  months: string[];
  onReset: () => void;
}

export default function FilterSection({
  searchQuery,
  setSearchQuery,
  selectedGugun,
  setSelectedGugun,
  selectedMonth,
  setSelectedMonth,
  guguns,
  months,
  onReset,
}: FilterSectionProps) {
  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/40 p-4 shadow-xl backdrop-blur-md sm:p-6">
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-4 items-end">
        {/* Search Input */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
            축제 검색
          </label>
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="축제 이름 또는 내용 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 pr-4 pl-10 text-sm text-slate-100 placeholder-slate-500 transition-all focus:border-blue-500 focus:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Gugun Selector */}
        <div>
          <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
            지역구 선택
          </label>
          <div className="relative">
            <MapPin className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              value={selectedGugun}
              onChange={(e) => setSelectedGugun(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 pr-8 pl-10 text-sm text-slate-100 placeholder-slate-500 transition-all focus:border-blue-500 focus:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">전체 지역</option>
              {guguns.map((gugun) => (
                <option key={gugun} value={gugun}>
                  {gugun}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 border-t-2 border-r-2 border-slate-400 rotate-45 origin-center scale-[0.6]"></div>
          </div>
        </div>

        {/* Month Selector */}
        <div>
          <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
            개최 월
          </label>
          <div className="relative">
            <Calendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 pr-8 pl-10 text-sm text-slate-100 placeholder-slate-500 transition-all focus:border-blue-500 focus:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">전체 월</option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}월
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 border-t-2 border-r-2 border-slate-400 rotate-45 origin-center scale-[0.6]"></div>
          </div>
        </div>
      </div>

      {/* Quick Action Button for resetting filters */}
      {(searchQuery || selectedGugun || selectedMonth) && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950/40 hover:bg-slate-950 hover:border-slate-700 px-3  py-1.5 text-xs text-slate-400 hover:text-white transition-all"
          >
            <RotateCcw className="h-3 w-3" />
            필터 초기화
          </button>
        </div>
      )}
    </div>
  );
}
