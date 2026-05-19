"use server";

import { env } from "@/env";
import { proxyDispatcher, createTimeoutSignal } from "@/lib/image-search-proxy";

type PexelsImage = {
  url: string;
  thumb?: string;
  title?: string;
  author?: string;
  username?: string;
  link?: string;
};

interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
}

interface PexelsSearchResponse {
  total_results: number;
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
  next_page?: string;
}

export async function searchPexelsImages(
  query: string,
  perPage = 30,
  page = 1,
): Promise<{ success: boolean; images?: PexelsImage[]; error?: string }> {
  const apiKey = env.PEXELS_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: "PEXELS_API_KEY is not configured",
    };
  }

  try {
    const url = new URL("https://api.pexels.com/v1/search");
    url.searchParams.set("query", query);
    url.searchParams.set("per_page", String(perPage));
    url.searchParams.set("page", String(page));

    const response = await fetch(url.toString(), {
      signal: createTimeoutSignal(),
      dispatcher: proxyDispatcher,
      headers: {
        Authorization: apiKey,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Pexels API error: ${response.status} - ${errorBody}`,
      );
    }

    const data = (await response.json()) as PexelsSearchResponse;

    if (!data.photos || data.photos.length === 0) {
      return {
        success: false,
        error: "No images found for this query",
      };
    }

    return {
      success: true,
      images: data.photos.map((photo) => ({
        url: photo.src.large2x,
        thumb: photo.src.small,
        title: photo.alt || "",
        author: photo.photographer,
        username: photo.photographer,
        link: photo.url,
      })),
    };
  } catch (error) {
    console.error("Pexels search failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to search Pexels",
    };
  }
}

export async function getImageFromPexels(
  query: string,
  _layoutType?: string,
): Promise<{ success: boolean; imageUrl?: string; error?: string }> {
  const result = await searchPexelsImages(query, 1);

  if (!result.success || !result.images?.length) {
    return {
      success: false,
      error: result.error ?? "No Pexels images found",
    };
  }

  return {
    success: true,
    imageUrl: result.images[0]?.url ?? "",
  };
}
