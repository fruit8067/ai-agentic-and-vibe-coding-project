import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "부산 축제 가이드 - 한눈에 보는 부산의 축제 정보",
  description: "부산광역시의 다채로운 축제와 문화 행사를 실시간으로 확인하는 인터랙티브 가이드 맵입니다. 일정, 위치, 교통편 및 편의 시설을 확인해보세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#090e1a] text-slate-100">{children}</body>
    </html>
  );
}
