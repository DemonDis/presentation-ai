"use client";

import { useQuery } from "@tanstack/react-query";

interface CloudModelInfo {
  id: string;
  name: string;
}

const CLOUD_MODELS_API_URL = "/api/presentation/cloud-models";

async function fetchCloudModels(): Promise<CloudModelInfo[]> {
  const response = await fetch(CLOUD_MODELS_API_URL, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Cloud models API responded with ${response.status}`);
  }

  const data = (await response.json()) as { models: CloudModelInfo[] };
  return Array.isArray(data.models) ? data.models : [];
}

export function useCloudModels() {
  return useQuery({
    queryKey: ["cloud-models"],
    queryFn: fetchCloudModels,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  });
}

export type { CloudModelInfo };
