import { n as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as CircleCheck, M as ArrowLeft, T as CreditCard, _ as Mail, a as Stamp, j as ArrowRight, k as Check, l as ShieldAlert, m as PackageCheck, n as TriangleAlert, x as FileUp } from "../_libs/lucide-react.mjs";
import { i as SiteHeader, r as SiteFooter } from "./router-BwTSK_d9.mjs";
import { t as workflows } from "./workflows-DfwdFRvx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/court-ruling-NWCnZkxb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var stepLabels = [
	"Start",
	"Ruling",
	"Facts",
	"Objective",
	"Draft",
	"Review",
	"Attachments",
	"Recipient",
	"Mailing",
	"Checkout",
	"Done"
];
var mailOptions = [
	{
		id: "standard",
		label: "Standard",
		price: "$4.99",
		desc: "3–7 business days · Tracking included",
		icon: Mail
	},
	{
		id: "certified",
		label: "Certified",
		price: "$14.94",
		desc: "Delivery tracking + confirmation · 3–7 days",
		icon: PackageCheck
	},
	{
		id: "registered",
		label: "Registered",
		price: "$32.49",
		desc: "Secure handling + tracking · 5–10 days",
		icon: Stamp
	}
];
var reviewChecks = [
	"I reviewed every factual statement in this appeal.",
	"Case number, court name, and ruling date are correct.",
	"I reviewed the court's appeal rules and procedures.",
	"I understand Appeal Mail is not providing legal advice."
];
function CourtRuling() {
	const definition = workflows["court-ruling"];
	const [step, setStep] = (0, import_react.useState)(0);
	const [caseNumber, setCaseNumber] = (0, import_react.useState)("");
	const [courtName, setCourtName] = (0, import_react.useState)("");
	const [rulingDate, setRulingDate] = (0, import_react.useState)("");
	const [appealDeadline, setAppealDeadline] = (0, import_react.useState)("");
	const [rulingSummary, setRulingSummary] = (0, import_react.useState)("");
	const [facts, setFacts] = (0, import_react.useState)("");
	const [objective, setObjective] = (0, import_react.useState)("");
	const [draft, setDraft] = (0, import_react.useState)("");
	const [checks, setChecks] = (0, import_react.useState)(reviewChecks.map(() => false));
	const [mailType, setMailType] = (0, import_react.useState)("certified");
	const [recipient, setRecipient] = (0, import_react.useState)({
		name: "",
		org: "",
		address1: "",
		address2: "",
		city: "",
		state: "",
		zip: ""
	});
	const progress = (0, import_react.useMemo)(() => Math.round(step / (stepLabels.length - 1) * 100), [step]);
	const allChecked = checks.every(Boolean);
	function generateDraft() {
		return `Re: Notice of Appeal
${courtName ? `Court: ${courtName}` : ""}
${caseNumber ? `Case No.: ${caseNumber}` : ""}
${rulingDate ? `Ruling Date: ${rulingDate}` : ""}
${appealDeadline ? `Appeal Deadline: ${appealDeadline}` : ""}

Dear Clerk of the Court,

I am writing to appeal the ruling in the above-referenced case. ${objective || "[Your objective will appear here.]"}

${rulingSummary ? `The ruling being appealed: ${rulingSummary}` : ""}

${facts || "[The facts you provided will appear here.]"}

I respectfully request that this appeal be accepted for review.

Respectfully submitted,
[Your Name]`;
	}
	function canContinue() {
		switch (step) {
			case 1: return caseNumber.trim().length > 0;
			case 2: return facts.trim().length > 0;
			case 3: return objective.trim().length > 0;
			case 5: return allChecked;
			case 7: return recipient.name && recipient.address1 && recipient.city && recipient.state && recipient.zip;
			default: return true;
		}
	}
	function next() {
		if (step === 4 && !draft) setDraft(generateDraft());
		setStep((s) => Math.min(s + 1, stepLabels.length - 1));
	}
	function back() {
		setStep((s) => Math.max(s - 1, 0));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-screen bg-cream",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container py-8 md:py-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-3xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-8",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs font-semibold text-slate-400",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"Step ",
										step + 1,
										" of ",
										stepLabels.length
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [progress, "% complete"] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "progress-track mt-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "progress-fill",
										style: { width: `${progress}%` }
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 hidden justify-between text-[11px] text-slate-300 sm:flex",
									children: stepLabels.map((label, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: i <= step ? "font-semibold text-indigo-700" : "",
										children: label
									}, label))
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card p-6 md:p-10",
							children: [
								step === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "eyebrow",
										children: "Guided workflow"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "mt-3 text-3xl font-bold text-indigo-700",
										style: { fontFamily: "var(--font-serif)" },
										children: "Appeal a court ruling"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-4 leading-7 text-slate-400",
										children: "We'll help you organize the ruling, state your grounds, prepare an editable appeal letter, and move toward mailing."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "alert alert-warning mt-6",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, {
											size: 18,
											className: "mb-2 shrink-0"
										}), definition.disclaimer]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "alert alert-danger mt-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
												size: 16,
												className: "inline mr-1"
											}),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Critical:" }),
											" Court appeal deadlines are very short — often 10–30 days. Missing the deadline forfeits your right to appeal."
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-6 grid gap-3 sm:grid-cols-2",
										children: [
											"Upload or identify the ruling",
											"State your grounds and facts",
											"Review and edit the appeal",
											"Choose mailing and send"
										].map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 text-sm text-slate-500",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-400",
												children: i + 1
											}), item]
										}, item))
									})
								] }),
								step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "eyebrow",
										children: "1 · Upload / identify"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "mt-3 text-2xl font-bold text-indigo-700",
										style: { fontFamily: "var(--font-serif)" },
										children: "Start with the ruling"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-slate-400",
										children: "Upload the court ruling or identify the key details."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "upload-zone mt-7 block",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, {
												className: "mx-auto text-slate-400",
												size: 28
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mt-3 block font-semibold text-indigo-500",
												children: "Upload ruling / judgment"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mt-1 block text-sm text-slate-300",
												children: "PDF, JPG, or PNG"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "file",
												accept: "application/pdf,image/jpeg,image/png",
												className: "sr-only"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-6 grid gap-4 sm:grid-cols-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "input-label",
												children: "Case number *"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: "input-field",
												value: caseNumber,
												onChange: (e) => setCaseNumber(e.target.value),
												placeholder: "SC-2026-XXXX"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "input-label",
												children: "Court name"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: "input-field",
												value: courtName,
												onChange: (e) => setCourtName(e.target.value),
												placeholder: "Small Claims Court, Traffic Court"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "input-label",
												children: "Ruling date"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "date",
												className: "input-field",
												value: rulingDate,
												onChange: (e) => setRulingDate(e.target.value)
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "input-label",
												children: "Appeal deadline"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "date",
												className: "input-field",
												value: appealDeadline,
												onChange: (e) => setAppealDeadline(e.target.value)
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "sm:col-span-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "input-label",
													children: "Ruling summary"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													className: "input-field",
													value: rulingSummary,
													onChange: (e) => setRulingSummary(e.target.value),
													placeholder: "Brief summary of the court's decision"
												})]
											})
										]
									})
								] }),
								step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "eyebrow",
										children: "2 · Your facts"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "mt-3 text-2xl font-bold text-indigo-700",
										style: { fontFamily: "var(--font-serif)" },
										children: "What facts support your appeal?"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-slate-400",
										children: "Use your own words. Only include information you can verify."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										className: "input-field mt-6 min-h-48",
										value: facts,
										onChange: (e) => setFacts(e.target.value)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "alert alert-info mt-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Tip:" }), " Include specific errors of fact or law in the original ruling. Reference exhibit numbers, dates, and witness statements."]
									})
								] }),
								step === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "eyebrow",
										children: "3 · Your objective"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "mt-3 text-2xl font-bold text-indigo-700",
										style: { fontFamily: "var(--font-serif)" },
										children: "What outcome do you want?"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										className: "input-field mt-6 min-h-40",
										value: objective,
										onChange: (e) => setObjective(e.target.value),
										placeholder: "Example: I want the ruling reversed and a new trial ordered."
									})
								] }),
								step === 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "eyebrow",
										children: "4 · Draft"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "mt-3 text-2xl font-bold text-indigo-700",
										style: { fontFamily: "var(--font-serif)" },
										children: "Prepare your appeal"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-slate-400",
										children: "Review every fact, name, date, and statement before sending."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										className: "input-field mt-6 min-h-72 font-mono text-sm leading-6",
										value: draft,
										onChange: (e) => setDraft(e.target.value)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "alert alert-warning mt-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, {
											size: 16,
											className: "shrink-0"
										}), " Court appeals have strict procedural requirements. This draft is not legal advice. Consult an attorney if unsure."]
									})
								] }),
								step === 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "eyebrow",
										children: "5 · Review"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "mt-3 text-2xl font-bold text-indigo-700",
										style: { fontFamily: "var(--font-serif)" },
										children: "Review before anything is mailed"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-slate-400",
										children: "Please confirm each item below."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-6 space-y-3",
										children: reviewChecks.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "check-card",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: checks[i],
												onChange: (e) => setChecks((c) => c.map((v, j) => j === i ? e.target.checked : v))
											}), item]
										}, item))
									})
								] }),
								step === 6 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "eyebrow",
										children: "6 · Attachments"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "mt-3 text-2xl font-bold text-indigo-700",
										style: { fontFamily: "var(--font-serif)" },
										children: "Add supporting documents"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-slate-400",
										children: "Attach exhibits, transcripts, or evidence referenced in your appeal."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "upload-zone mt-6 block",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, {
												className: "mx-auto text-slate-400",
												size: 28
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mt-3 block font-semibold text-indigo-500",
												children: "Add attachments"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mt-1 block text-sm text-slate-300",
												children: "PDF, JPG, or PNG"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "file",
												accept: "application/pdf,image/jpeg,image/png",
												multiple: true,
												className: "sr-only"
											})
										]
									})
								] }),
								step === 7 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "eyebrow",
										children: "7 · Recipient"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "mt-3 text-2xl font-bold text-indigo-700",
										style: { fontFamily: "var(--font-serif)" },
										children: "Where should we send it?"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-slate-400",
										children: "Enter the court clerk's mailing address."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-6 grid gap-4 sm:grid-cols-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "sm:col-span-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "input-label",
													children: "Recipient name *"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													className: "input-field",
													value: recipient.name,
													onChange: (e) => setRecipient({
														...recipient,
														name: e.target.value
													}),
													placeholder: "Clerk of the Court"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "sm:col-span-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "input-label",
													children: "Court name"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													className: "input-field",
													value: recipient.org,
													onChange: (e) => setRecipient({
														...recipient,
														org: e.target.value
													})
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "sm:col-span-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "input-label",
													children: "Address line 1 *"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													className: "input-field",
													value: recipient.address1,
													onChange: (e) => setRecipient({
														...recipient,
														address1: e.target.value
													})
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "sm:col-span-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "input-label",
													children: "Address line 2"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													className: "input-field",
													value: recipient.address2,
													onChange: (e) => setRecipient({
														...recipient,
														address2: e.target.value
													})
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "input-label",
												children: "City *"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: "input-field",
												value: recipient.city,
												onChange: (e) => setRecipient({
													...recipient,
													city: e.target.value
												})
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "input-label",
												children: "State *"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: "input-field",
												value: recipient.state,
												onChange: (e) => setRecipient({
													...recipient,
													state: e.target.value
												})
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "input-label",
												children: "ZIP Code *"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: "input-field",
												value: recipient.zip,
												onChange: (e) => setRecipient({
													...recipient,
													zip: e.target.value
												})
											})] })
										]
									})
								] }),
								step === 8 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "eyebrow",
										children: "8 · Mailing options"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "mt-3 text-2xl font-bold text-indigo-700",
										style: { fontFamily: "var(--font-serif)" },
										children: "Choose your mail type"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-slate-400",
										children: "For court filings, certified mail with return receipt is recommended for proof of timely filing."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-6 grid gap-3 sm:grid-cols-2",
										children: mailOptions.map(({ id, label, price, desc, icon: Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `mail-option ${mailType === id ? "selected" : ""}`,
											onClick: () => setMailType(id),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-start justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
														size: 20,
														className: "text-indigo-500"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "font-semibold text-indigo-700",
														children: label
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs text-slate-400",
														children: desc
													})] })]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-right",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-lg font-bold text-indigo-700",
														style: { fontFamily: "var(--font-serif)" },
														children: price
													}), mailType === id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
														size: 16,
														className: "ml-auto text-amber-500"
													})]
												})]
											})
										}, id))
									})
								] }),
								step === 9 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "eyebrow",
										children: "9 · Checkout"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "mt-3 text-2xl font-bold text-indigo-700",
										style: { fontFamily: "var(--font-serif)" },
										children: "Review and pay"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-6 space-y-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between rounded-lg border border-warm-border px-4 py-3 text-sm",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-slate-500",
													children: "Mail type"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold text-indigo-700",
													children: mailOptions.find((m) => m.id === mailType)?.label
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between rounded-lg border border-warm-border px-4 py-3 text-sm",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-slate-500",
													children: "Recipient"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold text-indigo-700",
													children: recipient.name || "—"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between rounded-lg border border-warm-border px-4 py-3 text-sm",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-slate-500",
													children: "Total"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-lg font-bold text-indigo-700",
													style: { fontFamily: "var(--font-serif)" },
													children: mailOptions.find((m) => m.id === mailType)?.price
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "alert alert-info mt-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, {
											size: 16,
											className: "shrink-0"
										}), " Secure checkout via Stripe is being connected."]
									})
								] }),
								step === 10 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-center",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
												size: 32,
												className: "text-amber-600"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "mt-5 text-2xl font-bold text-indigo-700",
											style: { fontFamily: "var(--font-serif)" },
											children: "Your appeal has been submitted"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-3 text-slate-400",
											children: "Your appeal is being prepared for mailing."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-6 inline-flex items-center gap-2 rounded-xl border border-warm-border px-4 py-3 text-sm",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageCheck, {
													size: 16,
													className: "text-amber-500"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-slate-500",
													children: "Tracking number:"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono font-semibold text-indigo-700",
													children: "— Pending —"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-8 flex justify-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: "/",
												className: "btn-outline",
												children: "Back to home"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: "/workflows/court-ruling",
												className: "btn-primary",
												children: "Start another"
											})]
										})
									]
								}),
								step < 10 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-8 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: back,
										disabled: step === 0,
										className: "btn-ghost disabled:opacity-30",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 16 }), " Back"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: next,
										disabled: !canContinue(),
										className: "btn-primary",
										children: [
											step === 9 ? "Pay and send" : "Continue",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 16 })
										]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 text-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								className: "text-sm text-slate-400 hover:text-amber-600",
								children: "← Back to Appeal Mail"
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { CourtRuling as component };
