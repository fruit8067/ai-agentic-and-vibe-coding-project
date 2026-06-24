"use client";

import React from "react";
import { Sparkles, Calendar, MapPin } from "lucide-react";

export default function Header({ totalCount }: { totalCount: number }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-blue-900/40 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white shadow-md shadow-blue-500/20">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl flex items-center gap-1.5">
                <span className="text-gradient">부산 축제 가이드</span>
              </h1>
              <p className="hidden text-[10px] font-semibold tracking-wider text-slate-400 sm:block">
                FESTIVALS IN BUSAN
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 rounded-full border border-blue-900/60 bg-blue-950/40 px-3 py-1 text-xs font-medium text-blue-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500"></span>
              </span>
              <span>총 {totalCount}개의 활성 축제</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
