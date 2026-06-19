import { createServerFn, getRequest } from "@tanstack/react-start";

// Returns the visitor's country code as detected by the edge runtime
// (Cloudflare's cf-ipcountry, Vercel's x-vercel-ip-country, etc.).
// Used for soft phone-country matching.
export const getVisitorCountry = createServerFn({ method: "GET" }).handler(async () => {
  const headers = getRequest().headers;
  const cc =
    headers.get("cf-ipcountry") ||
    headers.get("x-vercel-ip-country") ||
    headers.get("x-country-code") ||
    null;
  return { country: cc ? cc.toUpperCase() : null };
});