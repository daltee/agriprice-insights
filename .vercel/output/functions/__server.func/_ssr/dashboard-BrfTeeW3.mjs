import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BNKIJ0Vf.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useAuth } from "./useAuth-Bmnla24_.mjs";
import { t as DashboardShell } from "./DashboardShell-xPHNG2Og.mjs";
import { a as Line, c as Tooltip, i as Area, n as YAxis, o as CartesianGrid, r as XAxis, s as ResponsiveContainer, t as ComposedChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-BrfTeeW3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Dashboard() {
	const { user } = useAuth();
	const [mine, setMine] = (0, import_react.useState)([]);
	const [all, setAll] = (0, import_react.useState)([]);
	const [selectedProduce, setSelectedProduce] = (0, import_react.useState)("");
	const [editPrice, setEditPrice] = (0, import_react.useState)(null);
	const load = () => {
		if (!user) return;
		supabase.from("price_entries").select("id, price, date_submitted, produce:produce_id(id, name), market:market_id(name)").eq("user_id", user.id).order("date_submitted", { ascending: false }).then(({ data }) => setMine(data ?? []));
		const sevenAgo = /* @__PURE__ */ new Date();
		sevenAgo.setDate(sevenAgo.getDate() - 7);
		supabase.from("price_entries").select("id, price, date_submitted, produce:produce_id(id, name), market:market_id(name)").gte("date_submitted", sevenAgo.toISOString()).then(({ data }) => setAll(data ?? []));
	};
	(0, import_react.useEffect)(load, [user]);
	const produceOptions = (0, import_react.useMemo)(() => {
		const m = /* @__PURE__ */ new Map();
		all.forEach((e) => e.produce && m.set(e.produce.id, e.produce.name));
		return Array.from(m, ([id, name]) => ({
			id,
			name
		})).sort((a, b) => a.name.localeCompare(b.name));
	}, [all]);
	(0, import_react.useEffect)(() => {
		if (!selectedProduce && produceOptions.length) setSelectedProduce(produceOptions[0].id);
	}, [produceOptions, selectedProduce]);
	const chartData = (0, import_react.useMemo)(() => {
		const days = Array.from({ length: 7 }).map((_, i) => {
			const d = /* @__PURE__ */ new Date();
			d.setDate(d.getDate() - (6 - i));
			return {
				date: d.toISOString().slice(0, 10),
				label: d.toLocaleDateString(void 0, { weekday: "short" }),
				price: null
			};
		});
		const byDay = /* @__PURE__ */ new Map();
		all.filter((e) => e.produce?.id === selectedProduce).forEach((e) => {
			const k = new Date(e.date_submitted).toISOString().slice(0, 10);
			const arr = byDay.get(k) ?? [];
			arr.push(Number(e.price));
			byDay.set(k, arr);
		});
		return days.map((d) => {
			const arr = byDay.get(d.date);
			return {
				...d,
				price: arr ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : null
			};
		});
	}, [all, selectedProduce]);
	const stats = (0, import_react.useMemo)(() => {
		const marketCounts = /* @__PURE__ */ new Map();
		all.forEach((e) => {
			if (e.market) marketCounts.set(e.market.name, (marketCounts.get(e.market.name) ?? 0) + 1);
		});
		const topMarket = Array.from(marketCounts.entries()).sort((a, b) => b[1] - a[1])[0];
		const byProduce = /* @__PURE__ */ new Map();
		[...all].sort((a, b) => +new Date(a.date_submitted) - +new Date(b.date_submitted)).forEach((e) => {
			if (!e.produce) return;
			const a = byProduce.get(e.produce.name) ?? [];
			a.push(Number(e.price));
			byProduce.set(e.produce.name, a);
		});
		let topChange = {
			name: "—",
			pct: 0
		};
		byProduce.forEach((arr, name) => {
			if (arr.length < 2) return;
			const pct = (arr[arr.length - 1] - arr[0]) / arr[0] * 100;
			if (Math.abs(pct) > Math.abs(topChange.pct)) topChange = {
				name,
				pct
			};
		});
		return {
			total: mine.length,
			topMarket: topMarket ? topMarket[0] : "—",
			topChange
		};
	}, [all, mine]);
	async function del(id) {
		if (!confirm("Delete this entry?")) return;
		await supabase.from("price_entries").delete().eq("id", id);
		load();
	}
	async function saveEdit() {
		if (!editPrice) return;
		await supabase.from("price_entries").update({ price: Number(editPrice.value) }).eq("id", editPrice.id);
		setEditPrice(null);
		load();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-6 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl mb-2",
				children: "Overview"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground mb-8",
				children: "A quick read on your contributions and market movement this week."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid md:grid-cols-3 gap-6 mb-10",
				children: [
					{
						label: "Entries submitted",
						value: stats.total
					},
					{
						label: "Most active market this week",
						value: stats.topMarket
					},
					{
						label: "Biggest price change",
						value: `${stats.topChange.name}${stats.topChange.pct ? ` · ${stats.topChange.pct > 0 ? "+" : ""}${stats.topChange.pct.toFixed(1)}%` : ""}`
					}
				].map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-rise bg-card border-t-2 border-gold border border-border rounded-md p-6",
					style: {
						animationDelay: `${i * 100}ms`,
						boxShadow: "0 4px 16px rgba(0,0,0,0.07)"
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-wider text-muted-foreground mb-2",
						children: c.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-2xl font-display",
						children: c.value
					})]
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-card border border-border rounded-md p-6 mb-10",
				style: { boxShadow: "0 4px 16px rgba(0,0,0,0.07)" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-4 mb-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl",
						children: "Price trend · last 7 days"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Average UGX/kg across all markets."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: selectedProduce,
						onChange: (e) => setSelectedProduce(e.target.value),
						className: "bg-background border border-border rounded-md px-3 py-2 text-sm",
						children: produceOptions.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: p.id,
							children: p.name
						}, p.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						width: "100%",
						height: 280
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ComposedChart, {
						data: chartData,
						margin: {
							top: 10,
							right: 16,
							left: 0,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
								id: "goldFill",
								x1: "0",
								y1: "0",
								x2: "0",
								y2: "1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "0%",
									stopColor: "#C9A84C",
									stopOpacity: .25
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "100%",
									stopColor: "#C9A84C",
									stopOpacity: 0
								})]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "#E5E0D7",
								strokeDasharray: "2 6",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "label",
								stroke: "#7a766f",
								tick: { fontSize: 12 },
								axisLine: false,
								tickLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								stroke: "#7a766f",
								tick: { fontSize: 12 },
								axisLine: false,
								tickLine: false,
								width: 56
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								background: "#1A1A1A",
								border: 0,
								color: "#C9A84C",
								fontSize: 12
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
								type: "monotone",
								dataKey: "price",
								stroke: "none",
								fill: "url(#goldFill)",
								connectNulls: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "price",
								stroke: "#C9A84C",
								strokeWidth: 2.5,
								dot: {
									r: 3,
									fill: "#C9A84C"
								},
								connectNulls: true
							})
						]
					}) })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-card border border-border rounded-md overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-6 py-4 border-b border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl",
						children: "Your submissions"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
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
								children: "Date"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3 font-medium text-right",
								children: "Actions"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: mine.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 5,
						className: "px-5 py-10 text-center text-muted-foreground",
						children: "You haven't submitted any prices yet."
					}) }) : mine.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border hover:bg-green-soft transition-colors duration-150",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-3 font-medium",
								children: r.produce?.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-3",
								children: r.market?.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-3 font-mono",
								children: editPrice?.id === r.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									autoFocus: true,
									value: editPrice.value,
									onChange: (e) => setEditPrice({
										id: r.id,
										value: e.target.value
									}),
									className: "w-24 bg-background border border-border rounded px-2 py-1 text-sm"
								}) : `UGX ${Number(r.price).toLocaleString()}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-3 text-muted-foreground",
								children: new Date(r.date_submitted).toLocaleDateString()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-3 text-right space-x-2",
								children: editPrice?.id === r.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: saveEdit,
									className: "text-xs px-3 py-1.5 bg-primary text-gold rounded hover:bg-primary/85 transition-colors duration-200",
									children: "Save"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setEditPrice(null),
									className: "text-xs px-3 py-1.5 border border-border rounded hover:bg-muted transition-colors duration-200",
									children: "Cancel"
								})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setEditPrice({
										id: r.id,
										value: String(r.price)
									}),
									className: "text-xs px-3 py-1.5 border border-border rounded hover:bg-muted transition-colors duration-200",
									children: "Edit"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => del(r.id),
									className: "text-xs px-3 py-1.5 text-destructive border border-destructive/40 rounded hover:bg-destructive/10 transition-colors duration-200",
									children: "Delete"
								})] })
							})
						]
					}, r.id)) })]
				})]
			})
		]
	}) });
}
//#endregion
export { Dashboard as component };
