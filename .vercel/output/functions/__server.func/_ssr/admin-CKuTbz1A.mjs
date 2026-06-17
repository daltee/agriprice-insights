import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BNKIJ0Vf.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { r as useUserRole } from "./useAuth-Bmnla24_.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as DashboardShell } from "./DashboardShell-xPHNG2Og.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-CKuTbz1A.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Admin() {
	const role = useUserRole();
	const navigate = useNavigate();
	const [entries, setEntries] = (0, import_react.useState)([]);
	const [users, setUsers] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (role && role !== "admin") navigate({ to: "/dashboard" });
	}, [role, navigate]);
	const load = () => {
		supabase.from("price_entries").select("id, price, date_submitted, produce:produce_id(name), market:market_id(name)").order("date_submitted", { ascending: false }).limit(100).then(({ data }) => setEntries(data ?? []));
		supabase.from("profiles").select("id, name, email, role, created_at").order("created_at", { ascending: false }).then(({ data }) => setUsers(data ?? []));
	};
	(0, import_react.useEffect)(load, []);
	async function delEntry(id) {
		if (!confirm("Delete this entry?")) return;
		await supabase.from("price_entries").delete().eq("id", id);
		load();
	}
	if (role !== "admin") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-10 text-muted-foreground",
		children: "Checking admin access…"
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-6 py-10 space-y-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl mb-2",
				children: "Admin"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: "Manage submitted entries and registered users."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl mb-4",
				children: "Recent entries"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-card border border-border rounded-md overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted/60 text-left",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3 font-medium",
								children: "Produce"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3 font-medium",
								children: "Market"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3 font-medium",
								children: "Price"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3 font-medium",
								children: "By"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3 font-medium",
								children: "Date"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: entries.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border hover:bg-green-soft transition-colors duration-150",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-3 font-medium",
								children: e.produce?.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-3",
								children: e.market?.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-5 py-3 font-mono",
								children: ["UGX ", Number(e.price).toLocaleString()]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-3 text-muted-foreground",
								children: "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-3 text-muted-foreground",
								children: new Date(e.date_submitted).toLocaleDateString()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-3 text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => delEntry(e.id),
									className: "text-xs px-3 py-1.5 text-destructive border border-destructive/40 rounded hover:bg-destructive/10 transition-colors duration-200",
									children: "Delete"
								})
							})
						]
					}, e.id)) })]
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl mb-4",
				children: "Users"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-card border border-border rounded-md overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted/60 text-left",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3 font-medium",
								children: "Name"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3 font-medium",
								children: "Email"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3 font-medium",
								children: "Role"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3 font-medium",
								children: "Joined"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: users.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-3 font-medium",
								children: u.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-3 text-muted-foreground",
								children: u.email
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-3 capitalize",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "px-2 py-0.5 text-xs rounded bg-muted",
									children: u.role
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-3 text-muted-foreground",
								children: new Date(u.created_at).toLocaleDateString()
							})
						]
					}, u.id)) })]
				})
			})] })
		]
	}) });
}
//#endregion
export { Admin as component };
