import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { S as FileText, l as ShieldAlert } from "../_libs/lucide-react.mjs";
import { i as SiteHeader, r as SiteFooter } from "./router-BwTSK_d9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/terms-98nCXC_o.js
var import_jsx_runtime = require_jsx_runtime();
var sections = [
	{
		title: "Acceptance of Terms",
		body: "By using Appeal Mail, you agree to these Terms of Service."
	},
	{
		title: "Description of Service",
		body: "Appeal Mail provides guided workflows for preparing appeal letters and physical mailing services via USPS."
	},
	{
		title: "Not Legal Advice",
		body: "Appeal Mail is not a law firm. We do not provide legal advice or representation. The AI assistant organizes information you provide but does not invent facts or draw legal conclusions."
	},
	{
		title: "User Responsibilities",
		body: "You are responsible for the accuracy of all information. You must review every draft before approving it for mailing. You are responsible for meeting all applicable deadlines."
	},
	{
		title: "Acceptable Use",
		body: "You agree not to use Appeal Mail to send fraudulent or misleading correspondence."
	},
	{
		title: "Payment & Refunds",
		body: "Payment is processed via Stripe before mailing. Refunds are available if the mailing hasn't been submitted for processing."
	},
	{
		title: "Limitation of Liability",
		body: "Appeal Mail is provided 'as is.' We are not liable for outcomes related to your correspondence. Our liability is limited to the cost of the mailing service."
	},
	{
		title: "Contact",
		body: "For questions about these terms, contact us at support@appealmail.app."
	}
];
function TermsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-screen bg-cream",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "bg-white py-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "container max-w-3xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
									size: 20,
									className: "text-indigo-700"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-3xl font-bold text-indigo-700",
								style: { fontFamily: "var(--font-serif)" },
								children: "Terms of Service"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-slate-400",
								children: "Last updated: August 2026"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "alert alert-warning mt-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, {
								size: 18,
								className: "shrink-0"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Important:" }), " Appeal Mail is not a law firm and does not provide legal advice."] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-8 space-y-6",
							children: sections.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-semibold text-indigo-700",
								style: { fontFamily: "var(--font-serif)" },
								children: s.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-7 text-slate-400",
								children: s.body
							})] }, s.title))
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { TermsPage as component };
