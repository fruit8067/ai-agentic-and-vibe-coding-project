"use client";

import React, { useState } from "react";
import { FestivalItem } from "@/types/festival";
import { X, Calendar, MapPin, Phone, Globe, Navigation, Heart, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FestivalDetailProps {
  festival: FestivalItem | null;
  onClose: () => void;
  onShowOnMap: () => void;
}

export default function FestivalDetail({ festival, onClose, onShowOnMap }: FestivalDetailProps) {
  const [imgError, setImgError] = useState(false);

  if (!festival) return null;

  // Split description by double newlines or format paragraphs
  const paragraphs = festival.ITEMCNTNTS
    ? festival.ITEMCNTNTS.split("\n\n").filter((p) => p.trim().length > 0)
    : ["축제 상세 설명 정보가 제공되지 않습니다."];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative z-10 flex h-full max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl"
        >
          {/* Header Image Section */}
          <div className="relative h-60 shrink-0 bg-slate-950 sm:h-80 md:h-96">
            <img
              src={imgError ? "https://images.unsplash.com/photo-1578351723555-520e18146740?q=80&w=1200&auto=format&fit=crop" : festival.MAIN_IMG_NORMAL}
              alt={festival.MAIN_TITLE}
              onError={() => setImgError(true)}
              className="h-full w-full object-cover"
            />
            {/* Dark overlay on top image */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
            
            {/* Back/Close buttons */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-950/80 text-slate-400 hover:text-white backdrop-blur-sm hover:scale-105 transition-all border border-slate-800"
              aria-label="닫기"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Title / Subtitle */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-2">
                <span className="rounded bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                  {festival.GUGUN_NM}
                </span>
                {festival.USAGE_AMOUNT && (
                  <span className="rounded bg-slate-800/80 px-2 py-0.5 text-[10px] font-bold text-slate-300 backdrop-blur-sm border border-slate-700">
                    {festival.USAGE_AMOUNT.split("\n")[0]}
                  </span>
                )}
              </div>
              <h2 className="mt-2 text-xl font-black text-white sm:text-2xl md:text-3xl">
                {festival.MAIN_TITLE}
              </h2>
              {festival.TITLE && (
                <p className="mt-1 text-xs text-slate-300 sm:text-sm line-clamp-1 font-medium italic">
                  &ldquo;{festival.TITLE}&rdquo;
                </p>
              )}
            </div>
          </div>

          {/* Body Section */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column: Info Grid */}
              <div className="md:col-span-1 space-y-4">
                <h4 className="text-xs font-bold tracking-wider text-slate-400 uppercase">기본 정보</h4>
                
                <div className="space-y-3 rounded-2xl bg-slate-950/40 p-4 border border-slate-800/60 text-sm">
                  {/* Date */}
                  <div className="flex gap-2.5">
                    <Calendar className="h-4.5 w-4.5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-300 text-xs">축제 기간</div>
                      <div className="text-slate-400 text-xs mt-0.5">
                        {festival.USAGE_DAY_WEEK_AND_TIME || festival.USAGE_DAY || "일정 미정"}
                      </div>
                    </div>
                  </div>

                  {/* Place */}
                  <div className="flex gap-2.5">
                    <MapPin className="h-4.5 w-4.5 text-cyan-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-300 text-xs">장소</div>
                      <div className="text-slate-400 text-xs mt-0.5">
                        {festival.MAIN_PLACE || "부산 일원"}
                        {festival.ADDR1 && <span className="block text-[11px] text-slate-500 mt-0.5">{festival.ADDR1}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  {festival.CNTCT_TEL && (
                    <div className="flex gap-2.5">
                      <Phone className="h-4.5 w-4.5 text-pink-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-slate-300 text-xs">문의처</div>
                        <div className="text-slate-400 text-xs mt-0.5">{festival.CNTCT_TEL}</div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      onClick={() => {
                        onShowOnMap();
                        onClose();
                      }}
                      className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 py-2 text-xs font-bold text-white shadow-md shadow-blue-900/30 transition-all active:scale-[0.98]"
                    >
                      <Navigation className="h-3.5 w-3.5" />
                      지도에서 위치 보기
                    </button>

                    {festival.HOMEPAGE_URL && (
                      <a
                        href={festival.HOMEPAGE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 py-2 text-xs font-bold text-slate-300 hover:text-white transition-all border border-slate-700"
                      >
                        <Globe className="h-3.5 w-3.5" />
                        공식 홈페이지 방문
                      </a>
                    )}
                  </div>
                </div>

                {/* Accessibility Alert */}
                {festival.MIDDLE_SIZE_RM1 && (
                  <div className="rounded-2xl border border-emerald-900/50 bg-emerald-950/20 p-4 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                      <Heart className="h-4 w-4 fill-current" />
                      <span>무장애 관광 편의 시설</span>
                    </div>
                    <p className="mt-1.5 text-slate-400 leading-relaxed font-medium">
                      {festival.MIDDLE_SIZE_RM1}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column: Description & Traffic */}
              <div className="md:col-span-2 space-y-6">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold tracking-wider text-slate-400 uppercase">축제 소개</h4>
                  <div className="space-y-4 text-slate-300 text-sm leading-relaxed font-light">
                    {paragraphs.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>
                </div>

                {/* Traffic Info */}
                {festival.TRFC_INFO && (
                  <div className="rounded-2xl border border-slate-850 bg-slate-950/30 p-5 space-y-2">
                    <h5 className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                      <Navigation className="h-3.5 w-3.5 text-cyan-400" />
                      오시는 길 (교통 정보)
                    </h5>
                    <p className="text-xs text-slate-400 whitespace-pre-line leading-relaxed">
                      {festival.TRFC_INFO}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
