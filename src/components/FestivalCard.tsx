"use client";

import React, { useState } from "react";
import { FestivalItem } from "@/types/festival";
import { Calendar, MapPin, Ticket, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface FestivalCardProps {
  festival: FestivalItem;
  onClick: () => void;
}

export default function FestivalCard({ festival, onClick }: FestivalCardProps) {
  const [imgError, setImgError] = useState(false);

  // Parse a friendly date from the date strings
  const dateInfo = festival.USAGE_DAY_WEEK_AND_TIME || festival.USAGE_DAY || "연중무휴 / 일정 미정";

  // Check accessibility from middle size rm
  const hasAccessibility = festival.MIDDLE_SIZE_RM1 && 
    (festival.MIDDLE_SIZE_RM1.includes("장애인") || festival.MIDDLE_SIZE_RM1.includes("휠체어") || festival.MIDDLE_SIZE_RM1.includes("수어"));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="glass-card flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl bg-card-bg/30"
    >
      {/* Image container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
        <img
          src={imgError ? "https://images.unsplash.com/photo-1578351723555-520e18146740?q=80&w=600&auto=format&fit=crop" : festival.MAIN_IMG_THUMB}
          alt={festival.MAIN_TITLE}
          onError={() => setImgError(true)}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
          loading="lazy"
        />
        
        {/* District badge */}
        <div className="absolute top-3 left-3 rounded-lg bg-white/80 dark:bg-slate-950/80 px-2.5 py-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400 backdrop-blur-sm border border-cyan-500/25 shadow-md">
          {festival.GUGUN_NM}
        </div>

        {/* Accessibility tag if present */}
        {hasAccessibility && (
          <div className="absolute top-3 right-3 rounded-lg bg-emerald-500/80 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm shadow-md">
            장벽 없는 축제
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <span className="text-[10px] font-bold tracking-wider text-blue-500 dark:text-blue-400 uppercase">
          {festival.PLACE.split(",")[0] || "부산 대표 축제"}
        </span>
        <h3 className="mt-1 text-base font-bold text-foreground line-clamp-1 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
          {festival.MAIN_TITLE}
        </h3>
        
        <p className="mt-2 text-xs text-text-secondary line-clamp-2 min-h-[2rem]">
          {festival.TITLE || festival.SUBTITLE || "매혹적인 바다의 정취와 흥미로운 행사를 즐겨보세요."}
        </p>

        {/* Details list */}
        <div className="mt-auto pt-4 border-t border-card-border/60 space-y-2 text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-blue-500 shrink-0" />
            <span className="truncate">{dateInfo}</span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <MapPin className="h-3.5 w-3.5 text-cyan-500 shrink-0" />
              <span className="truncate">{festival.MAIN_PLACE || "부산 일원"}</span>
            </div>
            
            <div className="flex items-center gap-1 text-[11px] font-semibold text-text-secondary bg-slate-100 dark:bg-slate-950/40 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 shrink-0">
              <Ticket className="h-3 w-3 text-pink-500" />
              <span>{festival.USAGE_AMOUNT.split("\n")[0] || "무료"}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
