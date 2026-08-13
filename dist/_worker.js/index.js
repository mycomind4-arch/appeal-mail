globalThis.__nitro_main__ = import.meta.url;
import { n as HTTPError, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { r as FastResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_7ydggH = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_7ydggH
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"6f-RVSeZ2g3Xv3Rh1OVpa92UwbnUJs\"",
		"mtime": "2026-08-13T06:09:05.846Z",
		"size": 111,
		"path": "../robots.txt"
	},
	"/llms.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"497-n7OLWwYdjsYRppir+43bpmjlt2Y\"",
		"mtime": "2026-08-13T06:09:05.846Z",
		"size": 1175,
		"path": "../llms.txt"
	},
	"/assets/_slug-BHtfF02U.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2176-avP6eBwOXqsDGKZnGnuwoWWoWBY\"",
		"mtime": "2026-08-13T06:09:05.163Z",
		"size": 8566,
		"path": "../assets/_slug-BHtfF02U.js"
	},
	"/sitemap.xml": {
		"type": "application/xml",
		"etag": "\"7f0-Ab+0tmQWtPBsw1btTncRZ49ru20\"",
		"mtime": "2026-08-13T06:09:05.846Z",
		"size": 2032,
		"path": "../sitemap.xml"
	},
	"/assets/about-CzzVPzrg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14a9-QkMoHkboJqtA1nNmxbYEC03z16M\"",
		"mtime": "2026-08-13T06:09:05.164Z",
		"size": 5289,
		"path": "../assets/about-CzzVPzrg.js"
	},
	"/assets/auth-D2FD0O9_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f88-JmVwImS2EbV1kBdkl6QqFY7Gt3c\"",
		"mtime": "2026-08-13T06:09:05.164Z",
		"size": 3976,
		"path": "../assets/auth-D2FD0O9_.js"
	},
	"/assets/chevron-down-BZbTplyQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"75-SohV/+SFbASmOQNiuY+J/gLcGIU\"",
		"mtime": "2026-08-13T06:09:05.164Z",
		"size": 117,
		"path": "../assets/chevron-down-BZbTplyQ.js"
	},
	"/assets/circle-check-CkWQozP1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a7-cyfs4xOC0hRdv6IvXl82vnL3sUc\"",
		"mtime": "2026-08-13T06:09:05.164Z",
		"size": 167,
		"path": "../assets/circle-check-CkWQozP1.js"
	},
	"/assets/check-DInHJGB_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"71-MOmoL4itz5OvPC6sk1ClRyeZCQA\"",
		"mtime": "2026-08-13T06:09:05.164Z",
		"size": 113,
		"path": "../assets/check-DInHJGB_.js"
	},
	"/assets/contact-BLRNNRMH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1502-KSQFKatlIAAGbrPSfkBNu8/L8rg\"",
		"mtime": "2026-08-13T06:09:05.164Z",
		"size": 5378,
		"path": "../assets/contact-BLRNNRMH.js"
	},
	"/assets/denied-claim-DureiLGy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"412b-jonwuEjy9thSi0wjt2L2F9lJj1E\"",
		"mtime": "2026-08-13T06:09:05.164Z",
		"size": 16683,
		"path": "../assets/denied-claim-DureiLGy.js"
	},
	"/assets/clock-9h7-HL2J.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9e-rTswyUWEXZujCuGxUi151qxkbsI\"",
		"mtime": "2026-08-13T06:09:05.164Z",
		"size": 158,
		"path": "../assets/clock-9h7-HL2J.js"
	},
	"/assets/court-ruling-MdP4CFCl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3f2f-wwJ/3xPaRqIjO+6Wh19FlonDtsw\"",
		"mtime": "2026-08-13T06:09:05.164Z",
		"size": 16175,
		"path": "../assets/court-ruling-MdP4CFCl.js"
	},
	"/assets/dashboard-CDEv4P2g.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c9b-PgUeuSAMQPWctxXvK89HJJJljNI\"",
		"mtime": "2026-08-13T06:09:05.164Z",
		"size": 7323,
		"path": "../assets/dashboard-CDEv4P2g.js"
	},
	"/assets/government-decision-O9cwuYVf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3eb9-lUzTeFB9WJZ7uLLWaQQs427dWe4\"",
		"mtime": "2026-08-13T06:09:05.164Z",
		"size": 16057,
		"path": "../assets/government-decision-O9cwuYVf.js"
	},
	"/assets/file-up-CTOUJ4iM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"156-zArHE7yYm3O+IoIHVXE6l5Q+9ok\"",
		"mtime": "2026-08-13T06:09:05.164Z",
		"size": 342,
		"path": "../assets/file-up-CTOUJ4iM.js"
	},
	"/assets/file-text-CnUixjyL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"176-gEn1lUFvcjl/Nue2iqxiHphrVWo\"",
		"mtime": "2026-08-13T06:09:05.164Z",
		"size": 374,
		"path": "../assets/file-text-CnUixjyL.js"
	},
	"/assets/faq-Bp5wH7Fv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f68-C77Z3jDjAdftRGOvm37cd6WLnMI\"",
		"mtime": "2026-08-13T06:09:05.164Z",
		"size": 3944,
		"path": "../assets/faq-Bp5wH7Fv.js"
	},
	"/assets/lock-Bf7R8tYy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c3-qPJxDAOS9CtkPM7aQyRdt38uFE4\"",
		"mtime": "2026-08-13T06:09:05.164Z",
		"size": 195,
		"path": "../assets/lock-Bf7R8tYy.js"
	},
	"/assets/mail-CgV3a1Ay.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ca-WxWGc7W6/rTMJmRtaeR+ibW5Fzw\"",
		"mtime": "2026-08-13T06:09:05.164Z",
		"size": 202,
		"path": "../assets/mail-CgV3a1Ay.js"
	},
	"/assets/package-check-uIvcfNO0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19f-Wq1nLHtVuX1xy3CXO+3Dgqn7mhs\"",
		"mtime": "2026-08-13T06:09:05.164Z",
		"size": 415,
		"path": "../assets/package-check-uIvcfNO0.js"
	},
	"/assets/pricing-bgaFhrl7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"12d6-/WS9jEG779yunO4xQqF6lp1fXDY\"",
		"mtime": "2026-08-13T06:09:05.164Z",
		"size": 4822,
		"path": "../assets/pricing-bgaFhrl7.js"
	},
	"/assets/reconsideration-C1AroA2C.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3f2f-teAa4ekXYjIs3C3ILUvCbWaEI/Q\"",
		"mtime": "2026-08-13T06:09:05.164Z",
		"size": 16175,
		"path": "../assets/reconsideration-C1AroA2C.js"
	},
	"/assets/index-DhImZerk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5664e-hENh9o/lUOMApyeN+wnceT9O/kI\"",
		"mtime": "2026-08-13T06:09:05.163Z",
		"size": 353870,
		"path": "../assets/index-DhImZerk.js"
	},
	"/assets/privacy-C7UtVN9M.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f2d-4lnr4EZjUup5uy3Rem45WHwHGTM\"",
		"mtime": "2026-08-13T06:09:05.164Z",
		"size": 3885,
		"path": "../assets/privacy-C7UtVN9M.js"
	},
	"/assets/resources-D2d9W9jE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dc8-+MKmwn5mrdiUK6Oz7VhAVgZb7Ok\"",
		"mtime": "2026-08-13T06:09:05.164Z",
		"size": 3528,
		"path": "../assets/resources-D2d9W9jE.js"
	},
	"/assets/routes-wB6s16Bz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"58a5-IE+nj04vRD6/9By9vU/YZrdic04\"",
		"mtime": "2026-08-13T06:09:05.164Z",
		"size": 22693,
		"path": "../assets/routes-wB6s16Bz.js"
	},
	"/assets/shield-alert-CVVpSRfO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"156-zYOhm3PhgFcGXamvhB8efkD+8h8\"",
		"mtime": "2026-08-13T06:09:05.164Z",
		"size": 342,
		"path": "../assets/shield-alert-CVVpSRfO.js"
	},
	"/assets/shield-check-B1xd1ENY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"135-8A7bjZEtWcyzO6OzWx5mzDzvB0U\"",
		"mtime": "2026-08-13T06:09:05.164Z",
		"size": 309,
		"path": "../assets/shield-check-B1xd1ENY.js"
	},
	"/assets/sparkles-BwIUyajq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e3-lfmdfmCfZfjSIzBWMphSSzhfuPs\"",
		"mtime": "2026-08-13T06:09:05.164Z",
		"size": 483,
		"path": "../assets/sparkles-BwIUyajq.js"
	},
	"/assets/stamp-BTRYMrA6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"136-oUXECYHKCghqz1wcVyYQlh4r8lE\"",
		"mtime": "2026-08-13T06:09:05.164Z",
		"size": 310,
		"path": "../assets/stamp-BTRYMrA6.js"
	},
	"/assets/styles-P7rSzEpM.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"7c8f-Nml6ExBobO+N3IYCQdercUmsplA\"",
		"mtime": "2026-08-13T06:09:05.165Z",
		"size": 31887,
		"path": "../assets/styles-P7rSzEpM.css"
	},
	"/assets/terms-DpZzgAU0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a8e-wAZH2csib9IFkbav+mjjIFoGip0\"",
		"mtime": "2026-08-13T06:09:05.164Z",
		"size": 2702,
		"path": "../assets/terms-DpZzgAU0.js"
	},
	"/assets/workflows-D04dIlDN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"826-VSL5zMyB1/q/wuz6hO0ZcdY1vDo\"",
		"mtime": "2026-08-13T06:09:05.164Z",
		"size": 2086,
		"path": "../assets/workflows-D04dIlDN.js"
	},
	"/assets/triangle-alert-Gy_08HoU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"16e-FNq+rMN2dwnJGSEWoSuTb/EQIW4\"",
		"mtime": "2026-08-13T06:09:05.164Z",
		"size": 366,
		"path": "../assets/triangle-alert-Gy_08HoU.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-pages.mjs
var nitroApp = useNitroApp();
var cloudflare_pages_default = {
	async fetch(cfReq, env, context) {
		augmentReq(cfReq, {
			env,
			context
		});
		const url = new URL(cfReq.url);
		if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfReq);
		return nitroApp.fetch(cfReq);
	},
	scheduled(event, env, context) {}
};
//#endregion
export { cloudflare_pages_default as default };
