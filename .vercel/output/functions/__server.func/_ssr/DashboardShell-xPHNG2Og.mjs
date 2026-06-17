import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BNKIJ0Vf.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useAuth, r as useUserRole, t as Logo } from "./useAuth-Bmnla24_.mjs";
import { _ as useNavigate, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/DashboardShell-xPHNG2Og.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NAV = [
	{
		to: "/dashboard",
		label: "Overview"
	},
	{
		to: "/submit",
		label: "Submit price"
	},
	{
		to: "/prices",
		label: "All prices"
	}
];
function DashboardShell({ children }) {
	const path = useRouterState({ select: (s) => s.location.pathname });
	const [open, setOpen] = (0, import_react.useState)(false);
	const { user, loading } = useAuth();
	const role = useUserRole();
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		if (!loading && !user) navigate({
			to: "/auth",
			search: { redirect: path }
		});
	}, [
		user,
		loading,
		navigate,
		path
	]);
	if (loading || !user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center text-sm text-muted-foreground",
		children: "Loading…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex",
		children: [
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 bg-black/40 z-40 md:hidden",
				onClick: () => setOpen(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: `fixed md:static inset-y-0 left-0 w-64 bg-sidebar text-sidebar-foreground z-50 transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-6 py-6 border-b border-sidebar-border",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {
								className: "h-7 w-auto",
								invert: true
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "py-4",
						children: [NAV.map((n) => {
							const active = path === n.to;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: n.to,
								onClick: () => setOpen(false),
								className: `block px-6 py-3 text-sm transition-colors duration-150 border-l-2 ${active ? "border-gold text-gold" : "border-transparent text-sidebar-foreground/80 hover:text-sidebar-foreground"}`,
								children: n.label
							}, n.to);
						}), role === "admin" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin",
							onClick: () => setOpen(false),
							className: `block px-6 py-3 text-sm transition-colors duration-150 border-l-2 ${path === "/admin" ? "border-gold text-gold" : "border-transparent text-sidebar-foreground/80 hover:text-sidebar-foreground"}`,
							children: "Admin"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute bottom-0 inset-x-0 px-6 py-5 border-t border-sidebar-border text-xs text-sidebar-foreground/70",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate",
							children: user.email
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => supabase.auth.signOut().then(() => navigate({ to: "/" })),
							className: "mt-2 text-gold hover:underline",
							children: "Sign out"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 flex flex-col min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-background",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { className: "h-6 w-auto" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setOpen(true),
						className: "p-2 border border-border rounded-md text-sm",
						children: "Menu"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 bg-background",
					children
				})]
			})
		]
	});
}
//#endregion
export { DashboardShell as t };
