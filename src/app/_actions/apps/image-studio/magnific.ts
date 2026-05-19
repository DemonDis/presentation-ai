"use server";

import { env } from "@/env";
import { proxyDispatcher, createTimeoutSignal } from "@/lib/image-search-proxy";

type MagnificImage = {
  url: string;
  thumb?: string;
  title?: string;
  author?: string;
  link?: string;
};

interface MagnificImageSource {
  size: string;
  key: string;
  url: string;
  type: string;
}

interface MagnificResource {
  id: number;
  title: string;
  url: string;
  image: MagnificImageSource;
  author: {
    name: string;
    id: number;
    avatar?: string;
  };
  licenses: {
    type: string;
    url: string;
  }[];
}

interface MagnificSearchResponse {
  data: MagnificResource[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    clean_search: boolean;
  };
}

export async function searchMagnificImages(
  query: string,
  limit = 30,
  page = 1,
): Promise<{ success: boolean; images?: MagnificImage[]; error?: string }> {
  const apiKey = env.MAGNIFIC_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: "MAGNIFIC_API_KEY is not configured",
    };
  }

  try {
    const url = new URL("https://api.magnific.com/v1/resources");
    url.searchParams.set("term", query);
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("page", String(page));
    url.searchParams.set("filters[content_type][photo]", "1");
    url.searchParams.set("filters[license][freemium]", "1");

    const response = await fetch(url.toString(), {
      signal: createTimeoutSignal(),
      dispatcher: proxyDispatcher,
      headers: {
        "x-magnific-api-key": apiKey,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Magnific API error: ${response.status} - ${errorBody}`,
      );
    }

    const data = (await response.json()) as MagnificSearchResponse;

    if (!data.data || data.data.length === 0) {
      return {
        success: false,
        error: "No images found for this query",
      };
    }

    return {
      success: true,
      images: data.data.map((resource) => ({
        url: resource.image.url,
        thumb: resource.image.url,
        title: resource.title,
        author: resource.author.name,
        link: resource.url,
      })),
    };
  } catch (error) {
    console.error("Magnific search failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to search Magnific",
    };
  }
}

export async function getImageFromMagnific(
  query: string,
  _layoutType?: string,
): Promise<{ success: boolean; imageUrl?: string; error?: string }> {
  const result = await searchMagnificImages(query, 1);

  if (!result.success || !result.images?.length) {
    return {
      success: false,
      error: result.error ?? "No Magnific images found",
    };
  }

  return {
    success: true,
    imageUrl: result.images[0]?.url ?? "",
  };
}
