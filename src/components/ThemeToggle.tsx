"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    // Read the current theme from documentElement class list
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    if (!theme) return;
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  if (theme === null) {
    // Skeleton placeholder to prevent layout shift during hydration
    return (
      <div className="h-9 w-9 rounded-xl border border-header-border bg-card-bg/50 animate-pulse" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-header-border bg-card-bg/50 text-text-secondary hover:text-foreground hover:bg-card-bg/80 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
      aria-label={theme === "dark" ? "라이트 모드로 변경" : "다크 모드로 변경"}
    >
      {theme === "dark" ? (
        <Sun className="h-4.5 w-4.5 text-amber-500 transition-transform duration-500 hover:rotate-45" />
      ) : (
        <Moon className="h-4.5 w-4.5 text-blue-600 transition-transform duration-500 hover:-rotate-12" />
      )}
    </button>
  );
}
