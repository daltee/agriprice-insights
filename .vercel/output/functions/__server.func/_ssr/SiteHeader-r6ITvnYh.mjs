import { t as supabase } from "./client-BNKIJ0Vf.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as useAuth, t as Logo } from "./useAuth-Bmnla24_.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SiteHeader-r6ITvnYh.js
var import_jsx_runtime = require_jsx_runtime();
function SiteHeader() {
	const { user } = useAuth();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "border-b border-border bg-background/90 backdrop-blur sticky top-0 z-40",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl flex items-center justify-between px-6 py-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { className: "h-7 w-auto" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "hidden md:flex items-center gap-8 text-sm font-medium",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/prices",
							className: "hover:text-primary transition-colors",
							children: "Prices"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/submit",
							className: "hover:text-primary transition-colors",
							children: "Submit"
						}),
						user && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dashboard",
							className: "hover:text-primary transition-colors",
							children: "Dashboard"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-3",
					children: user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => supabase.auth.signOut(),
						className: "text-sm px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors duration-200",
						children: "Sign out"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth",
						className: "text-sm font-medium hover:text-primary transition-colors",
						children: "Sign in"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth",
						search: { mode: "register" },
						className: "text-sm px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200",
						children: "Get started"
					})] })
				})
			]
		})
	});
}
//#endregion
export { SiteHeader as t };
