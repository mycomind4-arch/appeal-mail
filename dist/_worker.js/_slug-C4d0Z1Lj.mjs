import { n as require_jsx_runtime } from "./_libs/react+tanstack__react-query.mjs";
import { _ as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { E as Clock, M as ArrowLeft, f as Scale, m as PackageCheck, n as TriangleAlert } from "./_libs/lucide-react.mjs";
import { i as SiteHeader, n as Route$4, r as SiteFooter } from "./_ssr/router-BwTSK_d9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_slug-C4d0Z1Lj.js
var import_jsx_runtime = require_jsx_runtime();
function GuidePage() {
	const slug = Route$4.useParams().slug;
	const guide = {
		"understanding-appeal-deadlines": {
			title: "Understanding Appeal Deadlines: Don't Miss Yours",
			category: "Deadlines",
			readTime: "5 min",
			content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeadlinesContent, {})
		},
		"writing-an-effective-appeal-letter": {
			title: "Writing an Effective Appeal Letter",
			category: "Appeal Strategy",
			readTime: "6 min",
			content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WritingContent, {})
		},
		"certified-mail-for-appeals": {
			title: "Why Certified Mail Matters for Appeals",
			category: "Mailing",
			readTime: "4 min",
			content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CertifiedContent, {})
		}
	}[slug];
	if (!guide) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-screen bg-cream",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container py-20 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold text-indigo-700",
					children: "Guide not found"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/resources",
					className: "btn-outline mt-6",
					children: "Back to resources"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-screen bg-cream",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "bg-white py-12 md:py-16 border-b border-warm-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "container max-w-2xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/resources",
								className: "inline-flex items-center gap-1 text-sm text-slate-400 hover:text-amber-600",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 15 }), " All guides"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex items-center gap-3 text-xs text-slate-400",
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-3 text-3xl font-bold text-indigo-700 md:text-4xl",
								style: { fontFamily: "var(--font-serif)" },
								children: guide.title
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "py-10 md:py-14",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "container max-w-2xl prose-content",
						children: guide.content
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					style: { background: "linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)" },
					className: "py-12",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "container max-w-2xl text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl font-bold text-white",
								style: { fontFamily: "var(--font-serif)" },
								children: "Ready to appeal?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-white/60",
								children: "Start a guided workflow and get your appeal in the mail today."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/workflows/denied-claim",
								className: "btn-amber mt-6",
								children: "Start now"
							})
						]
					})
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function H2({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: "mt-10 text-xl font-bold text-indigo-700",
		style: { fontFamily: "var(--font-serif)" },
		children
	});
}
function P({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-4 text-sm leading-7 text-slate-500",
		children
	});
}
function UL({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "mt-4 space-y-2 pl-5 text-sm text-slate-500",
		style: { listStyle: "disc" },
		children
	});
}
function Callout({ children, type = "info" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `mt-6 ${type === "warning" ? "alert alert-warning" : type === "success" ? "alert alert-success" : "alert alert-info"}`,
		children
	});
}
function DeadlinesContent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(P, { children: "Appeal deadlines are the single most important factor in whether your appeal is successful. Miss the deadline, and your right to appeal may be gone forever." }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(H2, { children: "Typical deadline ranges" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(UL, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Insurance appeals:" }), " 30–180 days from the denial notice"] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Government benefits (SSA, VA):" }), " 60 days for formal appeals"] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Court rulings:" }), " 10–30 days — very short"] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Licensing boards:" }), " Varies widely — check your notice"] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Reconsideration requests:" }), " May have different deadlines than formal appeals"] })
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Callout, {
			type: "warning",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					size: 16,
					className: "inline mr-1"
				}),
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Critical:" }),
				" Count calendar days, not business days. If the deadline falls on a weekend or holiday, check whether it extends to the next business day."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(H2, { children: "How to protect yourself" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(UL, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Note the deadline immediately when you receive a denial" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Plan to mail at least a week before the deadline" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Use certified mail with return receipt for proof of timely filing" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Keep copies of everything you send" })
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Callout, {
			type: "success",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageCheck, {
					size: 16,
					className: "inline mr-1"
				}),
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Tip:" }),
				" Certified mail with return receipt gives you a signed card back — physical proof that your appeal was received on time."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(P, {
			className: "text-xs text-slate-300 mt-8",
			children: "This guide is for informational purposes only and does not constitute legal advice."
		})
	] });
}
function WritingContent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(P, { children: "A well-organized appeal letter can make the difference between a reversal and a denied appeal. Here's what to include and what to avoid." }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(H2, { children: "What to include" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(UL, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Reference numbers:" }), " Claim number, case number, policy number, or any identifier from the denial"] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Clear statement of what you're appealing:" }), " Don't leave the reviewer guessing"] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Grounds for appeal:" }), " Why the decision should be reversed — factual errors, missing evidence, policy misinterpretation"] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Supporting evidence:" }), " Reference any enclosed documents"] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "What outcome you want:" }), " Be specific about the resolution you're seeking"] })
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Callout, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, {
				size: 16,
				className: "inline mr-1"
			}),
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Structure:" }),
			" Start with the reference, state your objective, present your facts, and close with your request. Keep it professional and concise."
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(H2, { children: "What to avoid" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(UL, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Emotional arguments — stick to facts" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Vague statements — be specific about what was wrong with the decision" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Missing information — always include reference numbers" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Invented facts — never fabricate or exaggerate" })
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(P, {
			className: "text-xs text-slate-300 mt-8",
			children: "This guide is for informational purposes only and does not constitute legal advice."
		})
	] });
}
function CertifiedContent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(P, { children: "When filing an appeal, proof that your submission arrived on time can be just as important as the appeal itself. Certified mail with return receipt provides that proof." }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(H2, { children: "What is certified mail with return receipt?" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(P, { children: "Certified Mail provides a USPS tracking number and delivery record. The return receipt option adds a signed card that is mailed back to you as physical proof that the recipient accepted delivery." }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(H2, { children: "Why it matters for appeals" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(UL, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Proof of timely filing:" }), " If a reviewer claims your appeal arrived late, your receipt proves otherwise"] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Delivery date confirmation:" }), " The USPS record shows exactly when your appeal arrived"] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Signature proof:" }), " The return receipt shows who signed for the delivery"] })
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Callout, {
			type: "warning",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					size: 16,
					className: "inline mr-1"
				}),
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Don't rely on first-class mail alone" }),
				" for deadline-sensitive appeals. It lacks signature proof and a formal delivery record."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(P, {
			className: "text-xs text-slate-300 mt-8",
			children: "This guide is for informational purposes only and does not constitute legal advice."
		})
	] });
}
//#endregion
export { GuidePage as component };
