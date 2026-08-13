import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as BookOpen, E as Clock, j as ArrowRight } from "../_libs/lucide-react.mjs";
import { i as SiteHeader, r as SiteFooter } from "./router-DzhFuQZY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/resources-CewvzICF.js
var import_jsx_runtime = require_jsx_runtime();
var guides = [
	{
		slug: "understanding-appeal-deadlines",
		title: "Understanding Appeal Deadlines: Don't Miss Yours",
		excerpt: "Appeal deadlines can be very short. Here's what to know about deadlines for insurance, government, and court appeals.",
		readTime: "5 min",
		category: "Deadlines",
		icon: "⏰"
	},
	{
		slug: "writing-an-effective-appeal-letter",
		title: "Writing an Effective Appeal Letter",
		excerpt: "A clear, well-organized appeal letter can make the difference. Here's what to include and what to avoid.",
		readTime: "6 min",
		category: "Appeal Strategy",
		icon: "✍️"
	},
	{
		slug: "certified-mail-for-appeals",
		title: "Why Certified Mail Matters for Appeals",
		excerpt: "Proof of timely filing can be the difference between a successful appeal and a dismissed one.",
		readTime: "4 min",
		category: "Mailing",
		icon: "📮"
	}
];
function ResourcesIndex() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-screen bg-cream",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "bg-white py-16 md:py-20 border-b border-warm-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "container max-w-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "eyebrow",
							children: "Resources"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-3 text-4xl font-bold text-indigo-700 md:text-5xl",
							style: { fontFamily: "var(--font-serif)" },
							children: "Guides for your appeals"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-slate-400",
							children: "Practical, plain-language guides about appealing denied claims and decisions. Not legal advice."
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "py-12 md:py-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "container max-w-4xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-5",
						children: guides.map((guide) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/resources/$slug",
							params: { slug: guide.slug },
							className: "card group p-6 transition hover:-translate-y-0.5 hover:shadow-lg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-xl",
									children: guide.icon
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3 text-xs text-slate-400",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-amber-600",
												children: guide.category
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { size: 12 }),
													" ",
													guide.readTime
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "mt-2 text-xl font-semibold text-indigo-700 group-hover:text-amber-600 transition-colors",
											style: { fontFamily: "var(--font-serif)" },
											children: guide.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-sm leading-6 text-slate-400",
											children: guide.excerpt
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "mt-3 inline-flex items-center gap-1 text-sm font-semibold text-amber-600",
											children: ["Read guide ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
												size: 14,
												className: "transition-transform group-hover:translate-x-1"
											})]
										})
									]
								})]
							})
						}, guide.slug))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-10 rounded-xl border border-dashed border-warm-border bg-white p-6 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, {
							size: 24,
							className: "mx-auto text-slate-300"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-sm text-slate-400",
							children: [
								"More guides are being written. Have a topic? Let us know at ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-amber-600",
									children: "support@appealmail.app"
								}),
								"."
							]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { ResourcesIndex as component };
