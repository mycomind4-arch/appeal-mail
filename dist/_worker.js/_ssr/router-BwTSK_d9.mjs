import { n as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { _ as Link, f as createRouter, g as createRootRouteWithContext, h as createFileRoute, l as Scripts, m as lazyRouteComponent, p as Outlet, u as HeadContent } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { f as Scale, g as Menu, j as ArrowRight, t as X, y as House } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BwTSK_d9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var styles_default = "/assets/styles-JxgZwsFM.css";
function SiteHeader({ variant = "default" }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const transparent = variant === "transparent";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: `sticky top-0 z-50 border-b transition-all ${transparent ? "border-transparent bg-transparent" : "border-warm-border bg-white/95 backdrop-blur-sm"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container flex min-h-16 items-center justify-between py-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `flex h-9 w-9 items-center justify-center rounded-lg ${transparent ? "bg-white/15" : "bg-indigo-700"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, {
							size: 18,
							className: transparent ? "text-amber-400" : "text-amber-400"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `text-lg font-bold tracking-tight ${transparent ? "text-white" : "text-indigo-700"}`,
						style: { fontFamily: "var(--font-serif)" },
						children: "Appeal Mail"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "hidden items-center gap-7 md:flex",
					children: [
						{
							label: "How it works",
							href: "/#how"
						},
						{
							label: "What you can appeal",
							href: "/#workflows"
						},
						{
							label: "Pricing",
							href: "/pricing"
						},
						{
							label: "Resources",
							href: "/resources"
						},
						{
							label: "FAQ",
							href: "/faq"
						}
					].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: item.href,
						className: `text-sm font-medium transition-colors ${transparent ? "text-white/80 hover:text-white" : "text-indigo-500 hover:text-indigo-700"}`,
						children: item.label
					}, item.label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden items-center gap-3 md:flex",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/dashboard",
						className: `text-sm font-semibold ${transparent ? "text-white/90 hover:text-white" : "text-indigo-500 hover:text-indigo-700"}`,
						children: "My Mailings"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/workflows/denied-claim",
						className: "btn-amber",
						children: "Start"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "md:hidden",
					onClick: () => setOpen(!open),
					"aria-label": "Menu",
					children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
						size: 22,
						className: transparent ? "text-white" : "text-indigo-700"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
						size: 22,
						className: transparent ? "text-white" : "text-indigo-700"
					})
				})
			]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-warm-border bg-white md:hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container flex flex-col gap-1 py-3",
				children: [[
					{
						label: "How it works",
						href: "/#how"
					},
					{
						label: "What you can appeal",
						href: "/#workflows"
					},
					{
						label: "Pricing",
						href: "/pricing"
					},
					{
						label: "Resources",
						href: "/resources"
					},
					{
						label: "FAQ",
						href: "/faq"
					},
					{
						label: "My Mailings",
						href: "/dashboard"
					},
					{
						label: "Contact",
						href: "/contact"
					}
				].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: item.href,
					className: "rounded-lg px-3 py-2.5 text-sm font-medium text-indigo-500 hover:bg-indigo-50",
					onClick: () => setOpen(false),
					children: item.label
				}, item.label)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/workflows/denied-claim",
					className: "btn-amber mt-2 justify-center",
					onClick: () => setOpen(false),
					children: "Start"
				})]
			})
		})]
	});
}
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "border-t border-warm-border bg-white",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container py-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-8 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-700",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, {
									size: 16,
									className: "text-amber-400"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-base font-bold text-indigo-700",
								style: { fontFamily: "var(--font-serif)" },
								children: "Appeal Mail"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm leading-6 text-slate-400",
							children: "Prepare and send appeals for denied claims and decisions with confidence."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold text-indigo-700",
						children: "Product"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-3 space-y-2 text-sm text-slate-400",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "/#how",
								className: "hover:text-amber-600",
								children: "How it works"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "/#workflows",
								className: "hover:text-amber-600",
								children: "What you can appeal"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/pricing",
								className: "hover:text-amber-600",
								children: "Pricing"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/dashboard",
								className: "hover:text-amber-600",
								children: "My Mailings"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/faq",
								className: "hover:text-amber-600",
								children: "FAQ"
							}) })
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold text-indigo-700",
						children: "Resources"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-3 space-y-2 text-sm text-slate-400",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/resources",
								className: "hover:text-amber-600",
								children: "Guides"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/about",
								className: "hover:text-amber-600",
								children: "About"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/contact",
								className: "hover:text-amber-600",
								children: "Contact"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/privacy",
								className: "hover:text-amber-600",
								children: "Privacy Policy"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/terms",
								className: "hover:text-amber-600",
								children: "Terms of Service"
							}) })
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold text-indigo-700",
						children: "Important"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs leading-5 text-slate-400",
						children: "Appeal Mail is not a law firm and does not provide legal advice. Appeal deadlines can be very short — note yours immediately."
					})] })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 flex flex-col gap-3 border-t border-warm-border pt-6 text-xs text-slate-400 md:flex-row md:items-center md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "© 2026 Appeal Mail. Powered by MailMyPDF." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Information is educational and product-related, not legal advice." })]
			})]
		})
	});
}
var Route$15 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Appeal Mail — Appeal denied claims and decisions with confidence" },
			{
				name: "description",
				content: "Guided workflows to prepare, review, send, and track appeals for denied claims, government decisions, court rulings, and reconsideration requests. Physical mail with proof of delivery. Not a law firm — you control the facts."
			},
			{
				name: "robots",
				content: "index,follow"
			},
			{
				name: "theme-color",
				content: "#312e81"
			},
			{
				property: "og:title",
				content: "Appeal Mail — Appeal denied claims and decisions with confidence"
			},
			{
				property: "og:description",
				content: "Prepare, review, send, track, and keep a record of your appeals."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:site_name",
				content: "Appeal Mail"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: "Appeal Mail — Prepare and send appeals for denied claims and decisions"
			},
			{
				name: "twitter:description",
				content: "Guided workflows, physical mail with tracking, and proof of delivery."
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}]
	}),
	notFoundComponent: NotFoundPage,
	shellComponent: RootShell,
	component: RootComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$15.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
}
function NotFoundPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-screen bg-cream",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "py-20 md:py-32",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "container max-w-lg text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-50",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, {
								size: 36,
								className: "text-indigo-300"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-8 text-6xl font-bold text-indigo-700",
							style: { fontFamily: "var(--font-serif)" },
							children: "404"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 text-xl font-semibold text-indigo-500",
							children: "This ruling is being appealed elsewhere"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-slate-400",
							children: "The page you're looking for doesn't exist or has moved. Let's get you back on track."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap justify-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/",
								className: "btn-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { size: 16 }), " Back to home"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/workflows/denied-claim",
								className: "btn-amber",
								children: ["Start an appeal ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 16 })]
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
var $$splitComponentImporter$14 = () => import("./routes-Ln5J1jYf.mjs");
var Route$14 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./about-DA6HTOU3.mjs");
var Route$13 = createFileRoute("/about")({
	head: () => ({ meta: [{ title: "About — Appeal Mail" }, {
		name: "description",
		content: "Appeal Mail helps people prepare and send appeals for denied claims and decisions with guided workflows, AI-assisted drafting, and physical mail with tracking."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./auth-DdE2_Bm6.mjs");
var Route$12 = createFileRoute("/auth")({
	head: () => ({ meta: [
		{ title: "Sign In — Appeal Mail" },
		{
			name: "description",
			content: "Create an account or sign in to Appeal Mail."
		},
		{
			name: "robots",
			content: "noindex,nofollow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./contact-k8V-U8Mr.mjs");
var Route$11 = createFileRoute("/contact")({
	head: () => ({ meta: [{ title: "Contact — Appeal Mail" }, {
		name: "description",
		content: "Get in touch with the Appeal Mail team."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./dashboard-sFkhfBKW.mjs");
var Route$10 = createFileRoute("/dashboard")({
	head: () => ({ meta: [
		{ title: "My Mailings — Appeal Mail" },
		{
			name: "description",
			content: "View your mailing history, tracking status, and delivery records."
		},
		{
			name: "robots",
			content: "noindex,nofollow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./faq-D4C29q1F.mjs");
var Route$9 = createFileRoute("/faq")({
	head: () => ({ meta: [{ title: "FAQ — Appeal Mail" }, {
		name: "description",
		content: "Answers to common questions about Appeal Mail: how it works, mailing, privacy, legal scope, and pricing."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./pricing-hKBAdOj1.mjs");
var Route$8 = createFileRoute("/pricing")({
	head: () => ({ meta: [{ title: "Pricing — Appeal Mail" }, {
		name: "description",
		content: "Simple per-mailing pricing. Standard $4.99, Certified $14.94, Registered $32.49. Page-count tiers available. No subscription."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./privacy-DZ858bf3.mjs");
var Route$7 = createFileRoute("/privacy")({
	head: () => ({ meta: [{ title: "Privacy Policy — Appeal Mail" }, {
		name: "description",
		content: "How Appeal Mail collects, uses, stores, and protects your data and documents."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./terms-98nCXC_o.mjs");
var Route$6 = createFileRoute("/terms")({
	head: () => ({ meta: [{ title: "Terms of Service — Appeal Mail" }, {
		name: "description",
		content: "Terms of service for Appeal Mail."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./resources-Bf5wASOu.mjs");
var Route$5 = createFileRoute("/resources/")({
	head: () => ({ meta: [{ title: "Resources & Guides — Appeal Mail" }, {
		name: "description",
		content: "Guides for appealing denied claims, government decisions, and court rulings."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("../_slug-C4d0Z1Lj.mjs");
var Route$4 = createFileRoute("/resources/$slug")({
	head: () => ({ meta: [{ title: "Guides — Appeal Mail" }, {
		name: "description",
		content: "Guides for appealing denied claims and decisions."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./court-ruling-NWCnZkxb.mjs");
var Route$3 = createFileRoute("/workflows/court-ruling")({
	head: () => ({ meta: [{ title: "Appeal a Court Ruling — Appeal Mail" }, {
		name: "description",
		content: "Prepare an appeal for a small claims, traffic, or municipal court decision."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./denied-claim-CULHOsiP.mjs");
var Route$2 = createFileRoute("/workflows/denied-claim")({
	head: () => ({ meta: [{ title: "Appeal a Denied Claim — Appeal Mail" }, {
		name: "description",
		content: "Guided workflow to prepare and mail an appeal for a denied insurance claim, benefit denial, or workers' compensation decision."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./government-decision-CVbyR0Hy.mjs");
var Route$1 = createFileRoute("/workflows/government-decision")({
	head: () => ({ meta: [{ title: "Appeal a Government Decision — Appeal Mail" }, {
		name: "description",
		content: "Prepare an appeal for a denied government benefit, licensing decision, or agency ruling."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./reconsideration-Cr7vsaFg.mjs");
var Route = createFileRoute("/workflows/reconsideration")({
	head: () => ({ meta: [{ title: "Submit a Reconsideration — Appeal Mail" }, {
		name: "description",
		content: "Request an internal review or reconsideration before filing a formal appeal."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$14.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$15
});
var AboutRoute = Route$13.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$15
});
var AuthRoute = Route$12.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$15
});
var ContactRoute = Route$11.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$15
});
var DashboardRoute = Route$10.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => Route$15
});
var FaqRoute = Route$9.update({
	id: "/faq",
	path: "/faq",
	getParentRoute: () => Route$15
});
var PricingRoute = Route$8.update({
	id: "/pricing",
	path: "/pricing",
	getParentRoute: () => Route$15
});
var PrivacyRoute = Route$7.update({
	id: "/privacy",
	path: "/privacy",
	getParentRoute: () => Route$15
});
var TermsRoute = Route$6.update({
	id: "/terms",
	path: "/terms",
	getParentRoute: () => Route$15
});
var ResourcesIndexRoute = Route$5.update({
	id: "/resources/",
	path: "/resources/",
	getParentRoute: () => Route$15
});
var rootRouteChildren = {
	IndexRoute,
	AboutRoute,
	AuthRoute,
	ContactRoute,
	DashboardRoute,
	FaqRoute,
	PricingRoute,
	PrivacyRoute,
	TermsRoute,
	ResourcesSlugRoute: Route$4.update({
		id: "/resources/$slug",
		path: "/resources/$slug",
		getParentRoute: () => Route$15
	}),
	WorkflowsCourtRulingRoute: Route$3.update({
		id: "/workflows/court-ruling",
		path: "/workflows/court-ruling",
		getParentRoute: () => Route$15
	}),
	WorkflowsDeniedClaimRoute: Route$2.update({
		id: "/workflows/denied-claim",
		path: "/workflows/denied-claim",
		getParentRoute: () => Route$15
	}),
	WorkflowsGovernmentDecisionRoute: Route$1.update({
		id: "/workflows/government-decision",
		path: "/workflows/government-decision",
		getParentRoute: () => Route$15
	}),
	WorkflowsReconsiderationRoute: Route.update({
		id: "/workflows/reconsideration",
		path: "/workflows/reconsideration",
		getParentRoute: () => Route$15
	}),
	ResourcesIndexRoute
};
var routeTree = Route$15._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { SiteHeader as i, Route$4 as n, SiteFooter as r, router_exports as t };
