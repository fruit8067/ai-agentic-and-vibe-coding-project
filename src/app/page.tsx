import React from "react";
import FestivalDashboard from "@/components/FestivalDashboard";
import { getFestivals } from "@/utils/api";

// This makes the page dynamically revalidate at most once every hour
export const revalidate = 3600;

export default async function Home() {
  // Fetch initial festivals data on server side
  const initialFestivals = await getFestivals();

  return <FestivalDashboard initialFestivals={initialFestivals} />;
}
