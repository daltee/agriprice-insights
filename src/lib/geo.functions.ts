import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/start-server-core";

// Returns the visitor's country code as detected by the edge runtime
// (Cloudflare's cf-ipcountry, Vercel's x-vercel-ip-country, etc.).
// Used for soft phone-country matching.
export const getVisitorCountry = createServerFn({ method: "GET" }).handler(async () => {
  const cc =
    getRequestHeader("cf-ipcountry" as never) ||
    getRequestHeader("x-vercel-ip-country" as never) ||
    getRequestHeader("x-country-code" as never) ||
    null;
  return { country: cc ? String(cc).toUpperCase() : null };
});