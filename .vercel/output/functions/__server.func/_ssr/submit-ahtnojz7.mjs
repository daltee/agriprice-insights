import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BNKIJ0Vf.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useAuth } from "./useAuth-Bmnla24_.mjs";
import { t as DashboardShell } from "./DashboardShell-xPHNG2Og.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/submit-ahtnojz7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SubmitPage() {
	const { user } = useAuth();
	const [markets, setMarkets] = (0, import_react.useState)([]);
	const [produce, setProduce] = (0, import_react.useState)([]);
	const [produceId, setProduceId] = (0, import_react.useState)("");
	const [marketId, setMarketId] = (0, import_react.useState)("");
	const [price, setPrice] = (0, import_react.useState)("");
	const [success, setSuccess] = (0, import_react.useState)(null);
	const [err, setErr] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		Promise.all([supabase.from("markets").select("id, name").order("name"), supabase.from("produce").select("id, name").order("name")]).then(([m, p]) => {
			setMarkets(m.data ?? []);
			setProduce(p.data ?? []);
		});
	}, []);
	async function submit(e) {
		e.preventDefault();
		if (!user) return;
		setBusy(true);
		setErr(null);
		setSuccess(null);
		const { error } = await supabase.from("price_entries").insert({
			produce_id: produceId,
			market_id: marketId,
			user_id: user.id,
			price: Number(price),
			unit: "kg"
		});
		setBusy(false);
		if (error) setErr(error.message);
		else {
			setSuccess("Price submitted. Thank you for contributing.");
			setProduceId("");
			setMarketId("");
			setPrice("");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl px-6 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl mb-2",
				children: "Submit a price"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground mb-8",
				children: "Logging a current price in UGX per kilogram from a market you visited."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-card border border-border rounded-md p-8",
				style: { boxShadow: "0 4px 16px rgba(0,0,0,0.07)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: submit,
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "field-underline",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs text-muted-foreground block mb-1",
								children: "Produce"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								required: true,
								value: produceId,
								onChange: (e) => setProduceId(e.target.value),
								className: "w-full bg-transparent border-0 border-b border-border focus:outline-none py-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "Select produce"
								}), produce.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: p.id,
									children: p.name
								}, p.id))]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "field-underline",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs text-muted-foreground block mb-1",
								children: "Market"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								required: true,
								value: marketId,
								onChange: (e) => setMarketId(e.target.value),
								className: "w-full bg-transparent border-0 border-b border-border focus:outline-none py-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "Select market"
								}), markets.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: m.id,
									children: m.name
								}, m.id))]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "field-underline",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs text-muted-foreground block mb-1",
								children: "Price (UGX / kg)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "number",
								min: "1",
								step: "1",
								value: price,
								onChange: (e) => setPrice(e.target.value),
								placeholder: "e.g. 2500",
								className: "w-full bg-transparent border-0 border-b border-border focus:outline-none py-2 text-sm"
							})]
						}),
						success && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm py-3 px-4 rounded-md bg-green-soft text-primary border border-primary/20",
							children: success
						}),
						err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm py-3 px-4 rounded-md text-destructive border border-destructive/30",
							children: err
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							disabled: busy,
							className: "w-full py-3 bg-primary text-gold font-medium rounded-md hover:bg-primary/85 transition-colors duration-200 disabled:opacity-60",
							children: busy ? "Submitting…" : "Submit price"
						})
					]
				})
			})
		]
	}) });
}
//#endregion
export { SubmitPage as component };
