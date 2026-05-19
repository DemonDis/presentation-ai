import { env } from "@/env";
import { createLogger } from "@/lib/observability/logger";
import { NextResponse } from "next/server";

const routeLogger = createLogger("api:cloud-models");

export async function GET() {
  try {
    const baseUrl = env.PROVIDER_BASE_URL?.trim();
    const apiKey = env.PROVIDER_API_KEY?.trim() || env.OPENAI_API_KEY?.trim();

    if (!baseUrl) {
      return NextResponse.json(
        { models: [] },
        { status: 200 },
      );
    }

    const modelsUrl = `${baseUrl.replace(/\/+$/, "")}/models`;
    routeLogger.info("Fetching cloud models from provider", {
      baseUrl,
      modelsUrl,
    });

    const response = await fetch(modelsUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      routeLogger.warn("Failed to fetch cloud models", {
        status: response.status,
      });
      return NextResponse.json({ models: [] }, { status: 200 });
    }

    const data = (await response.json()) as {
      data?: Array<{ id: string }>;
    };

    const models = (data.data ?? [])
      .filter((m) => typeof m.id === "string" && m.id.length > 0)
      .map((m) => ({
        id: m.id,
        name: m.id,
      }));

    routeLogger.info("Cloud models fetched successfully", {
      count: models.length,
    });

    return NextResponse.json({ models });
  } catch (error) {
    routeLogger.error("Failed to fetch cloud models", error);
    return NextResponse.json({ models: [] }, { status: 200 });
  }
}
