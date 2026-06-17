import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as objectType, r as stringType, t as enumType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-DUsLdyh8.js
var $$splitComponentImporter = () => import("./auth-B0rd7rcP.mjs");
var searchSchema = objectType({
	mode: enumType(["login", "register"]).optional(),
	redirect: stringType().optional()
});
var Route = createFileRoute("/auth")({
	validateSearch: searchSchema,
	head: () => ({ meta: [{ title: "Sign in — AgriPrice" }, {
		name: "description",
		content: "Sign in or create an AgriPrice account to submit market prices."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
