import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BNKIJ0Vf.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route } from "./auth-DUsLdyh8.mjs";
import { t as SiteHeader } from "./SiteHeader-r6ITvnYh.mjs";
import { t as createLovableAuth } from "../_libs/lovable.dev__cloud-auth-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-B0rd7rcP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var lovableAuth = createLovableAuth();
var lovable = { auth: { signInWithOAuth: async (provider, opts) => {
	const result = await lovableAuth.signInWithOAuth(provider, {
		redirect_uri: opts?.redirect_uri,
		extraParams: { ...opts?.extraParams }
	});
	if (result.redirected) return result;
	if (result.error) return result;
	try {
		await supabase.auth.setSession(result.tokens);
	} catch (e) {
		return { error: e instanceof Error ? e : new Error(String(e)) };
	}
	return result;
} } };
function AuthPage() {
	const search = Route.useSearch();
	const navigate = useNavigate();
	const [mode, setMode] = (0, import_react.useState)(search.mode ?? "login");
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [role, setRole] = (0, import_react.useState)("farmer");
	const [err, setErr] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data }) => {
			if (data.session) navigate({ to: search.redirect ?? "/dashboard" });
		});
	}, [navigate, search.redirect]);
	async function submit(e) {
		e.preventDefault();
		setErr(null);
		setBusy(true);
		try {
			if (mode === "register") {
				const { error } = await supabase.auth.signUp({
					email,
					password,
					options: {
						data: {
							name,
							role
						},
						emailRedirectTo: window.location.origin + "/dashboard"
					}
				});
				if (error) throw error;
			} else {
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password
				});
				if (error) throw error;
			}
			navigate({ to: search.redirect ?? "/dashboard" });
		} catch (e) {
			setErr(e instanceof Error ? e.message : "Something went wrong");
		} finally {
			setBusy(false);
		}
	}
	async function google() {
		setErr(null);
		const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/dashboard" });
		if (res.error) setErr(res.error.message);
		else if (!res.redirected) navigate({ to: "/dashboard" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "flex-1 bg-muted/40 flex items-center justify-center px-6 py-16",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-md bg-card border border-border rounded-md p-8",
				style: { boxShadow: "0 4px 16px rgba(0,0,0,0.07)" },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl mb-1",
						children: mode === "login" ? "Sign in" : "Create your account"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mb-6",
						children: mode === "login" ? "Welcome back to AgriPrice." : "Join farmers and vendors logging market prices."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: google,
						type: "button",
						className: "w-full mb-4 px-4 py-2.5 border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors duration-200",
						children: "Continue with Google"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center text-xs text-muted-foreground mb-4",
						children: "or with email"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: submit,
						className: "space-y-5",
						children: [
							mode === "register" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "field-underline",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									value: name,
									onChange: (e) => setName(e.target.value),
									placeholder: "Full name",
									className: "w-full bg-transparent border-0 border-b border-border focus:outline-none py-2 text-sm"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "field-underline",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									type: "email",
									value: email,
									onChange: (e) => setEmail(e.target.value),
									placeholder: "Email",
									className: "w-full bg-transparent border-0 border-b border-border focus:outline-none py-2 text-sm"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "field-underline",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									type: "password",
									value: password,
									onChange: (e) => setPassword(e.target.value),
									placeholder: "Password",
									minLength: 6,
									className: "w-full bg-transparent border-0 border-b border-border focus:outline-none py-2 text-sm"
								})
							}),
							mode === "register" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs text-muted-foreground block mb-2",
								children: "I am a"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-2",
								children: ["farmer", "vendor"].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setRole(r),
									className: `flex-1 px-3 py-2 rounded-md border text-sm capitalize transition-colors duration-200 ${role === r ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"}`,
									children: r
								}, r))
							})] }),
							err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm text-destructive",
								children: err
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								disabled: busy,
								className: "w-full py-3 bg-primary text-gold font-medium rounded-md hover:bg-primary/85 transition-colors duration-200 disabled:opacity-60",
								children: busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 text-center text-sm text-muted-foreground",
						children: mode === "login" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["New here? ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setMode("register"),
							className: "text-primary hover:underline",
							children: "Create an account"
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Already have an account? ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setMode("login"),
							className: "text-primary hover:underline",
							children: "Sign in"
						})] })
					})
				]
			})
		})]
	});
}
//#endregion
export { AuthPage as component };
