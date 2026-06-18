import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BNKIJ0Vf.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useAuth-Bmnla24_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var agriprice_logo_default = "/assets/agriprice-logo-D-zQG_Wo.png";
function Logo({ className = "h-9 w-auto", invert = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: agriprice_logo_default,
		alt: "AgriPrice",
		className,
		style: invert ? { filter: "brightness(0) invert(1)" } : void 0,
		width: 1536,
		height: 1024
	});
}
function useAuth() {
	const [session, setSession] = (0, import_react.useState)(null);
	const [user, setUser] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
			setSession(s);
			setUser(s?.user ?? null);
		});
		supabase.auth.getSession().then(({ data }) => {
			setSession(data.session);
			setUser(data.session?.user ?? null);
			setLoading(false);
		});
		return () => sub.subscription.unsubscribe();
	}, []);
	return {
		session,
		user,
		loading
	};
}
function useUserRole() {
	const { user } = useAuth();
	const [role, setRole] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!user) {
			setRole(null);
			return;
		}
		supabase.from("user_roles").select("role").eq("user_id", user.id).then(({ data }) => {
			if (data?.some((r) => r.role === "admin")) setRole("admin");
			else if (data?.some((r) => r.role === "vendor")) setRole("vendor");
			else setRole("farmer");
		});
	}, [user]);
	return role;
}
//#endregion
export { useAuth as n, useUserRole as r, Logo as t };
