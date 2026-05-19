import { ProxyAgent } from "undici";

const PROXY_ENABLED = process.env.IMAGE_SEARCH_PROXY_ENABLED === "true";
const PROXY_URL = process.env.IMAGE_SEARCH_PROXY ?? "http://127.0.0.1:10809";
const TIMEOUT_MS = 15_000;

export const proxyDispatcher = PROXY_ENABLED ? new ProxyAgent(PROXY_URL) : undefined;

export function createTimeoutSignal(timeoutMs: number = TIMEOUT_MS): AbortSignal {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  controller.signal.addEventListener("abort", () => clearTimeout(timeout), {
    once: true,
  });
  return controller.signal;
}
