import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as Logo } from "./useAuth-Bmnla24_.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as SiteHeader } from "./SiteHeader-r6ITvnYh.mjs";
import { t as PriceTicker } from "./PriceTicker-m7qrvKJ4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-COMTW0I5.js
var import_jsx_runtime = require_jsx_runtime();
function Landing() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative bg-primary text-primary-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 opacity-40",
					style: { background: "radial-gradient(ellipse at top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 100%)" }
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto max-w-5xl px-6 py-28 md:py-40 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-center mb-10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {
								className: "h-16 md:h-20 w-auto",
								invert: false
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-4xl md:text-6xl leading-tight",
							children: "Know the price before you go"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 max-w-2xl mx-auto text-base md:text-lg opacity-85",
							children: "Daily produce prices from Mbarara and Masaka markets — submitted by farmers and vendors on the ground."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-12 flex flex-col sm:flex-row gap-4 justify-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/prices",
								className: "px-8 py-3 rounded-md bg-gold text-charcoal font-medium hover:bg-gold/90 transition-colors duration-200",
								children: "View today's prices"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/submit",
								className: "px-8 py-3 rounded-md border border-gold/60 text-gold hover:bg-gold/10 transition-colors duration-200",
								children: "Submit a price"
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceTicker, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "flex-1 bg-background",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-6xl px-6 py-20 grid md:grid-cols-3 gap-10",
					children: [
						{
							h: "Built for the ground",
							p: "Prices come from farmers and vendors who actually walk the markets — Mbarara Central, Nyendo, Kakoba and more."
						},
						{
							h: "One unit, one truth",
							p: "Every entry is price per kilogram so you can compare matoke in Masaka with matoke in Mbarara without converting."
						},
						{
							h: "Free to use",
							p: "Anyone can browse prices. Sign in to log a price, follow trends, or manage your market entries."
						}
					].map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t-2 border-gold pt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-xl mb-3",
							children: b.h
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground leading-relaxed",
							children: b.p
						})]
					}, i))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-border bg-background",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl px-6 py-8 text-sm text-muted-foreground flex flex-wrap items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { className: "h-5 w-auto" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "· Mbarara & Masaka" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" AgriPrice"
					] })]
				})
			})
		]
	});
}
//#endregion
export { Landing as component };
