import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/client-BNKIJ0Vf.js
function createSupabaseClient() {
	return createClient("https://qhyxlrrztejzmqfodvuj.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoeXhscnJ6dGVqem1xZm9kdnVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2OTc5MDIsImV4cCI6MjA5NzI3MzkwMn0.hnE0GZlNCBj14NceShJAnzEhxgF_J0dldP8lW7K5-b4", { auth: {
		storage: typeof window !== "undefined" ? localStorage : void 0,
		persistSession: true,
		autoRefreshToken: true
	} });
}
var _supabase;
var supabase = new Proxy({}, { get(_, prop, receiver) {
	if (!_supabase) _supabase = createSupabaseClient();
	return Reflect.get(_supabase, prop, receiver);
} });
//#endregion
export { supabase as t };
