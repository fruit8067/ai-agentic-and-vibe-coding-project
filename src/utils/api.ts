import { FestivalItem, FestivalResponse } from "@/types/festival";
import { MOCK_FESTIVALS } from "./mockData";

const API_KEY = "kVkC33x7gWwAwp4YarfhVlH%2BBRkORtsCcDxpVtDqj5k6LZUNfn%2FWV4MtMXxJc2CJW8C%2FclVUTPNnEJQHh8e57w%3D%3D";
const API_URL = `https://apis.data.go.kr/6260000/FestivalService/getFestivalKr?serviceKey=${API_KEY}&pageNo=1&numOfRows=100&resultType=json`;

// Clean main title by removing language suffix like "(한,영, 중간,중번,일)"
export function cleanTitle(title: string): string {
  return title.replace(/\(.*?\)/g, "").trim();
}

export async function getFestivals(): Promise<FestivalItem[]> {
  try {
    // Adding short timeout/revalidate logic
    const res = await fetch(API_URL, {
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      console.warn("Busan Festival API response was not OK, falling back to mock data");
      return normalizeFestivals(MOCK_FESTIVALS);
    }

    const data: FestivalResponse = await res.json();
    const items = data?.getFestivalKr?.item;

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.warn("Busan Festival API returned empty items, falling back to mock data");
      return normalizeFestivals(MOCK_FESTIVALS);
    }

    return normalizeFestivals(items);
  } catch (error) {
    console.error("Failed to fetch festivals from API, using fallback mock data:", error);
    return normalizeFestivals(MOCK_FESTIVALS);
  }
}

function normalizeFestivals(items: FestivalItem[]): FestivalItem[] {
  return items.map((item) => {
    // Normalize properties
    const lat = Number(item.LAT);
    const lng = Number(item.LNG);
    
    // Some API results might have placeholder or broken image links
    // Provide standard beautiful default photos of Busan if the URL looks invalid
    let mainImg = item.MAIN_IMG_NORMAL || item.MAIN_IMG_THUMB;
    let thumbImg = item.MAIN_IMG_THUMB || item.MAIN_IMG_NORMAL;

    // The API images sometimes lack extension or use HTTP instead of HTTPS
    if (mainImg && mainImg.startsWith("http://")) {
      mainImg = mainImg.replace("http://", "https://");
    }
    if (thumbImg && thumbImg.startsWith("http://")) {
      thumbImg = thumbImg.replace("http://", "https://");
    }

    // Default high-quality fallbacks for festivals
    const defaultBusanImg = "https://images.unsplash.com/photo-1578351723555-520e18146740?q=80&w=1000&auto=format&fit=crop";

    return {
      ...item,
      MAIN_TITLE: cleanTitle(item.MAIN_TITLE),
      LAT: isNaN(lat) || lat === 0 ? 35.179554 : lat, // default to Busan City Hall if missing
      LNG: isNaN(lng) || lng === 0 ? 129.075641 : lng,
      MAIN_IMG_NORMAL: mainImg || defaultBusanImg,
      MAIN_IMG_THUMB: thumbImg || defaultBusanImg,
      USAGE_AMOUNT: item.USAGE_AMOUNT || "무료",
    };
  });
}
