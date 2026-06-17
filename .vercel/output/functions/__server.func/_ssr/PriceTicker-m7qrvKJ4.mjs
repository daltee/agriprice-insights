import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BNKIJ0Vf.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PriceTicker-m7qrvKJ4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PriceTicker() {
	const [ticks, setTicks] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		supabase.from("price_entries").select("price, produce:produce_id(name), market:market_id(name)").order("date_submitted", { ascending: false }).limit(20).then(({ data }) => {
			if (!data) return;
			setTicks(data.map((d) => ({
				produce: d.produce?.name ?? "",
				market: d.market?.name ?? "",
				price: Number(d.price)
			})));
		});
	}, []);
	const items = ticks.length ? [...ticks, ...ticks] : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "bg-charcoal text-gold overflow-hidden border-y border-charcoal/50",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "ticker-track py-3",
			children: items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "px-8 text-sm tracking-wide opacity-70",
				children: "No prices submitted yet — be the first."
			}) : items.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "px-8 text-sm whitespace-nowrap tracking-wide",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold",
						children: t.produce
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "opacity-60 mx-2",
						children: "·"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.market }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "opacity-60 mx-2",
						children: "·"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono",
						children: [
							"UGX ",
							t.price.toLocaleString(),
							"/kg"
						]
					})
				]
			}, i))
		})
	});
}
//#endregion
export { PriceTicker as t };
