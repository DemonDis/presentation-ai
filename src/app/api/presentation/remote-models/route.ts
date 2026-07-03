import { NextResponse } from "next/server";
import { env } from "@/env";
import { appLogger } from "@/lib/observability/logger";

const routeLogger = appLogger.child("api:remote-models");

// Fallback static models for remote provider
// These are the model names
const FALLBACK_REMOTE_MODELS = [
  { id: "Qwen/Qwen3.5-397B-A17B-GPTQ-Int4", name: "Qwen3.5-397B", provider: "remote" as const },
];

const REMOTE_MODELS_API_URL = env.REMOTE_MODELS_API_URL;

interface RemoteModel {
  id: string;
  name: string;
  displayName?: string;
  description?: string;
  provider?: string;
}

interface RemoteModelsResponse {
  models?: RemoteModel[];
  data?: RemoteModel[];
}

export async function GET() {
  const requestId = crypto.randomUUID();

  // First, try to fetch from external API
  try {
    routeLogger.info("Fetching remote models from external API", {
      requestId,
      url: REMOTE_MODELS_API_URL,
    });

    const response = await fetch(REMOTE_MODELS_API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      // Short timeout for external API
      signal: AbortSignal.timeout(3000),
    });

    if (response.ok) {
      const data = (await response.json()) as RemoteModelsResponse;
      const rawModels = Array.isArray(data.models)
        ? data.models
        : Array.isArray(data.data)
          ? data.data
          : [];

      if (rawModels.length > 0) {
        // Transform models to our format
        const models = rawModels.map((model) => ({
          id: model.id || model.name || "",
          name: model.displayName || model.name || model.id || "",
          provider: (model.provider || "remote") as "ollama" | "lmstudio" | "remote",
          description: model.description,
        }));

        routeLogger.info("Remote models fetched successfully from external API", {
          requestId,
          count: models.length,
        });

        return NextResponse.json({ models, source: "external" });
      }
    }
  } catch (error) {
    routeLogger.warn("External API fetch failed, using fallback models", {
      requestId,
      error: error instanceof Error ? error.message : String(error),
    });
  }

  // Return fallback models if external API fails
  routeLogger.info("Returning fallback remote models", {
    requestId,
    count: FALLBACK_REMOTE_MODELS.length,
  });

  return NextResponse.json({
    models: FALLBACK_REMOTE_MODELS,
    source: "fallback",
  });
}
