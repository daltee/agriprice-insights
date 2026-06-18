import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BNKIJ0Vf.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as SiteHeader } from "./SiteHeader-r6ITvnYh.mjs";
import { t as PriceTicker } from "./PriceTicker-m7qrvKJ4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/prices-CB2fZG4m.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PricesPage() {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [markets, setMarkets] = (0, import_react.useState)([]);
	const [produce, setProduce] = (0, import_react.useState)([]);
	const [marketFilter, setMarketFilter] = (0, import_react.useState)("");
	const [produceFilter, setProduceFilter] = (0, import_react.useState)("");
	const [dateFilter, setDateFilter] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		Promise.all([supabase.from("markets").select("id, name").order("name"), supabase.from("produce").select("id, name").order("name")]).then(([m, p]) => {
			setMarkets(m.data ?? []);
			setProduce(p.data ?? []);
		});
	}, []);
	(0, import_react.useEffect)(() => {
		setLoading(true);
		let q = supabase.from("price_entries").select("id, price, unit, date_submitted, produce:produce_id(name), market:market_id(name, location)").order("date_submitted", { ascending: false }).limit(200);
		if (marketFilter) q = q.eq("market_id", marketFilter);
		if (produceFilter) q = q.eq("produce_id", produceFilter);
		if (dateFilter) {
			const start = new Date(dateFilter);
			const end = new Date(start);
			end.setDate(end.getDate() + 1);
			q = q.gte("date_submitted", start.toISOString()).lt("date_submitted", end.toISOString());
		}
		q.then(({ data }) => {
			setRows(data ?? []);
			setLoading(false);
		});
	}, [
		marketFilter,
		produceFilter,
		dateFilter
	]);
	const summary = (0, import_react.useMemo)(() => {
		if (!rows.length) return null;
		const avg = rows.reduce((s, r) => s + Number(r.price), 0) / rows.length;
		return {
			count: rows.length,
			avg
		};
	}, [rows]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceTicker, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 bg-background",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl px-6 py-12",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-3xl md:text-4xl mb-2",
							children: "Today's market prices"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground mb-8",
							children: summary ? `${summary.count} entries · average UGX ${Math.round(summary.avg).toLocaleString()}/kg` : "Loading entries…"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-card border border-border rounded-md p-4 mb-6 grid sm:grid-cols-4 gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: marketFilter,
									onChange: (e) => setMarketFilter(e.target.value),
									className: "bg-background border border-border rounded-md px-3 py-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "All markets"
									}), markets.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: m.id,
										children: m.name
									}, m.id))]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: produceFilter,
									onChange: (e) => setProduceFilter(e.target.value),
									className: "bg-background border border-border rounded-md px-3 py-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "All produce"
									}), produce.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: p.id,
										children: p.name
									}, p.id))]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									value: dateFilter,
									onChange: (e) => setDateFilter(e.target.value),
									className: "bg-background border border-border rounded-md px-3 py-2 text-sm"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => {
										setMarketFilter("");
										setProduceFilter("");
										setDateFilter("");
									},
									className: "text-sm border border-border rounded-md px-3 py-2 hover:bg-muted transition-colors duration-200",
									children: "Reset filters"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
											children: "Price (UGX/kg)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-5 py-3 font-medium",
											children: "Market"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-5 py-3 font-medium",
											children: "Submitted by"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-5 py-3 font-medium",
											children: "Date"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: 5,
									className: "px-5 py-10 text-center text-muted-foreground",
									children: "Loading…"
								}) }) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: 5,
									className: "px-5 py-10 text-center text-muted-foreground",
									children: "No entries match those filters."
								}) }) : rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "row-fade border-t border-border hover:bg-green-soft transition-colors duration-150",
									style: { animationDelay: `${Math.min(i, 30) * 80}ms` },
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-3 font-medium",
											children: r.produce?.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-3 font-mono",
											children: Number(r.price).toLocaleString()
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-5 py-3",
											children: [
												r.market?.name,
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-muted-foreground text-xs",
													children: ["· ", r.market?.location]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-3 text-muted-foreground",
											children: r.profile?.name ?? "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-3 text-muted-foreground",
											children: new Date(r.date_submitted).toLocaleDateString()
										})
									]
								}, r.id)) })]
							})
						})
					]
				})
			})
		]
	});
}
//#endregion
export { PricesPage as component };
