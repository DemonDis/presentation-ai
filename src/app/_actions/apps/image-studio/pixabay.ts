"use server";

import { env } from "@/env";
import { proxyDispatcher, createTimeoutSignal } from "@/lib/image-search-proxy";

type PixabayImage = {
  url: string;
  thumb?: string;
  title?: string;
  author?: string;
  link?: string;
};

interface PixabayApiHit {
  id: number;
  webformatURL: string;
  previewURL: string;
  largeImageURL: string;
  imageWidth: number;
  imageHeight: number;
  pageURL: string;
  tags: string;
  user: string;
}

interface PixabayApiResponse {
  total: number;
  totalHits: number;
  hits: PixabayApiHit[];
}

export async function searchPixabayImages(
  query: string,
  perPage = 30,
  page = 1,
): Promise<{ success: boolean; images?: PixabayImage[]; error?: string }> {
  const apiKey = env.PIXABAY_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: "PIXABAY_API_KEY is not configured",
    };
  }

  try {
    const url = new URL("https://pixabay.com/api/");
    url.searchParams.set("key", apiKey);
    url.searchParams.set("q", query);
    url.searchParams.set("image_type", "photo");
    url.searchParams.set("per_page", String(perPage));
    url.searchParams.set("page", String(page));
    url.searchParams.set("safesearch", "true");

    const response = await fetch(url.toString(), {
      signal: createTimeoutSignal(),
      dispatcher: proxyDispatcher,
    });

    if (!response.ok) {
      throw new Error(`Pixabay API error: ${response.status}`);
    }

    const data = (await response.json()) as PixabayApiResponse;

    if (!data.hits || data.hits.length === 0) {
      return {
        success: false,
        error: "No images found for this query",
      };
    }

    return {
      success: true,
      images: data.hits.map((hit) => ({
        url: hit.largeImageURL,
        thumb: hit.previewURL,
        title: hit.tags,
        author: hit.user,
        link: hit.pageURL,
      })),
    };
  } catch (error) {
    console.error("Pixabay search failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to search Pixabay",
    };
  }
}

export async function getImageFromPixabay(
  query: string,
  _layoutType?: string,
): Promise<{ success: boolean; imageUrl?: string; error?: string }> {
  const result = await searchPixabayImages(query, 1);

  if (!result.success || !result.images?.length) {
    return {
      success: false,
      error: result.error ?? "No Pixabay images found",
    };
  }

  return {
    success: true,
    imageUrl: result.images[0]?.url ?? "",
  };
}
