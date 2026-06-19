import { createServerFn, getRequestHeader } from "@tanstack/react-start";

// Returns the visitor's country code as detected by Cloudflare (cf-ipcountry).
// Falls back to null if not present. Used for soft phone-country matching.
export const getVisitorCountry = createServerFn({ method: "GET" }).handler(async () => {
  const cc =
    getRequestHeader("cf-ipcountry") ||
    getRequestHeader("x-vercel-ip-country") ||
    getRequestHeader("x-country-code") ||
    null;
  return { country: cc ? String(cc).toUpperCase() : null };
});