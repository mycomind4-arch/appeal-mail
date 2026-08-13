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
	"/llms.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"497-n7OLWwYdjsYRppir+43bpmjlt2Y\"",
		"mtime": "2026-08-13T06:21:23.281Z",
		"size": 1175,
		"path": "../llms.txt"
	},
	"/assets/_slug-riixDBgI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2176-WXwB7ztYLYY4pRZutKChKgfCiNU\"",
		"mtime": "2026-08-13T06:21:22.582Z",
		"size": 8566,
		"path": "../assets/_slug-riixDBgI.js"
	},
	"/sitemap.xml": {
		"type": "application/xml",
		"etag": "\"7f0-Ab+0tmQWtPBsw1btTncRZ49ru20\"",
		"mtime": "2026-08-13T06:21:23.281Z",
		"size": 2032,
		"path": "../sitemap.xml"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"6f-RVSeZ2g3Xv3Rh1OVpa92UwbnUJs\"",
		"mtime": "2026-08-13T06:21:23.281Z",
		"size": 111,
		"path": "../robots.txt"
	},
	"/assets/about-BK0nAK60.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14a9-d+1iP46CoONGbRnwZUgb9u0HveM\"",
		"mtime": "2026-08-13T06:21:22.582Z",
		"size": 5289,
		"path": "../assets/about-BK0nAK60.js"
	},
	"/assets/chevron-down-BCxN1-mq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"75-X7ootZn1+08cAg2NQNtP+WtSNnw\"",
		"mtime": "2026-08-13T06:21:22.582Z",
		"size": 117,
		"path": "../assets/chevron-down-BCxN1-mq.js"
	},
	"/assets/auth-CeAq921F.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f88-C6eH5DjSSIfIiqdLGBfcfkNO5e0\"",
		"mtime": "2026-08-13T06:21:22.582Z",
		"size": 3976,
		"path": "../assets/auth-CeAq921F.js"
	},
	"/assets/check-BszOCJiY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"71-5B2hYbzN/Xgf33rMB7g9j4Ab51M\"",
		"mtime": "2026-08-13T06:21:22.582Z",
		"size": 113,
		"path": "../assets/check-BszOCJiY.js"
	},
	"/assets/contact-BHgfalPw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1502-cadjGJKFE4tmrRAQD36TA/DQIv4\"",
		"mtime": "2026-08-13T06:21:22.582Z",
		"size": 5378,
		"path": "../assets/contact-BHgfalPw.js"
	},
	"/assets/circle-check-BliLRxf-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a7-a0CwOFjV83NEqmcXtZ/hVZEpd0c\"",
		"mtime": "2026-08-13T06:21:22.582Z",
		"size": 167,
		"path": "../assets/circle-check-BliLRxf-.js"
	},
	"/assets/clock-CKTxhPkV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9e-ZoM1H6Wu/rAwmSbGSem50R0UQ60\"",
		"mtime": "2026-08-13T06:21:22.582Z",
		"size": 158,
		"path": "../assets/clock-CKTxhPkV.js"
	},
	"/assets/court-ruling-CtQxoQT8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3eb7-gQ2x6ayygtIQggn9xqRVLpTwe0I\"",
		"mtime": "2026-08-13T06:21:22.582Z",
		"size": 16055,
		"path": "../assets/court-ruling-CtQxoQT8.js"
	},
	"/assets/denied-claim-CBehylkK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"40b3-hjFcujxUYmMKUvaf+lVw1rS8I1g\"",
		"mtime": "2026-08-13T06:21:22.582Z",
		"size": 16563,
		"path": "../assets/denied-claim-CBehylkK.js"
	},
	"/assets/dashboard-DhjPZEXJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c9b-H7hjkQWd4lU1KJIT9CHOEJxSb44\"",
		"mtime": "2026-08-13T06:21:22.582Z",
		"size": 7323,
		"path": "../assets/dashboard-DhjPZEXJ.js"
	},
	"/assets/faq-C-2d3YQU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f68-xolpTJqsovFB7Q7pSYrdyo2KM30\"",
		"mtime": "2026-08-13T06:21:22.582Z",
		"size": 3944,
		"path": "../assets/faq-C-2d3YQU.js"
	},
	"/assets/file-up-D1P6aTt0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"156-WXeMwmEflseOgcg2krlmo6ZrfZ4\"",
		"mtime": "2026-08-13T06:21:22.582Z",
		"size": 342,
		"path": "../assets/file-up-D1P6aTt0.js"
	},
	"/assets/file-text-BLKUzzxG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"176-Vc047+2RxhuUJLYN5XIPnfD0arI\"",
		"mtime": "2026-08-13T06:21:22.582Z",
		"size": 374,
		"path": "../assets/file-text-BLKUzzxG.js"
	},
	"/assets/government-decision-DvDOiIFH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3e41-anBei5JKolo/eUEzxa/qGYdOaNc\"",
		"mtime": "2026-08-13T06:21:22.582Z",
		"size": 15937,
		"path": "../assets/government-decision-DvDOiIFH.js"
	},
	"/assets/lock-B7zv2g05.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c3-YMScNYKpELkKh24kXDBs1wnyFiY\"",
		"mtime": "2026-08-13T06:21:22.582Z",
		"size": 195,
		"path": "../assets/lock-B7zv2g05.js"
	},
	"/assets/mail-ilKTkIPe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ca-PTiCTG/MjRpR7trW0fdhP27AmvY\"",
		"mtime": "2026-08-13T06:21:22.582Z",
		"size": 202,
		"path": "../assets/mail-ilKTkIPe.js"
	},
	"/assets/pricing-BfqnvhIb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11c5-RP2i5BGvOr2+QMPQlB3/l90rWhc\"",
		"mtime": "2026-08-13T06:21:22.582Z",
		"size": 4549,
		"path": "../assets/pricing-BfqnvhIb.js"
	},
	"/assets/index-LTYoWlJ9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"56640-22kfOtUbw3faRZWNqfWildZRmWg\"",
		"mtime": "2026-08-13T06:21:22.581Z",
		"size": 353856,
		"path": "../assets/index-LTYoWlJ9.js"
	},
	"/assets/package-check-C2howf8e.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19f-GlacaWDzaZN2MJtk4NvnGka/u9Y\"",
		"mtime": "2026-08-13T06:21:22.582Z",
		"size": 415,
		"path": "../assets/package-check-C2howf8e.js"
	},
	"/assets/privacy-B3ZlLxNS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f2d-pLI3Ikdo5dAc8uOWSpgyDrC0/Fc\"",
		"mtime": "2026-08-13T06:21:22.582Z",
		"size": 3885,
		"path": "../assets/privacy-B3ZlLxNS.js"
	},
	"/assets/reconsideration-B5zlNTRk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3eba-P2P7o9CR3kq4Spk9uDnfYiny4wo\"",
		"mtime": "2026-08-13T06:21:22.582Z",
		"size": 16058,
		"path": "../assets/reconsideration-B5zlNTRk.js"
	},
	"/assets/resources-D7VDY5KR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dc8-QIEa3l9BRdn7i5wUJb1t3tgTc8o\"",
		"mtime": "2026-08-13T06:21:22.582Z",
		"size": 3528,
		"path": "../assets/resources-D7VDY5KR.js"
	},
	"/assets/shield-alert-CltHy-02.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"156-Wa5He2jJk3uqh1WwvghH2nglU0Y\"",
		"mtime": "2026-08-13T06:21:22.582Z",
		"size": 342,
		"path": "../assets/shield-alert-CltHy-02.js"
	},
	"/assets/routes-Bjqsilfd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5833-cMaQwY7iX9rwIzV/z5ESKD6aOqg\"",
		"mtime": "2026-08-13T06:21:22.582Z",
		"size": 22579,
		"path": "../assets/routes-Bjqsilfd.js"
	},
	"/assets/shield-check-CG1nr0ET.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"135-MkDw5H+3lILGMhUChownYppJERs\"",
		"mtime": "2026-08-13T06:21:22.582Z",
		"size": 309,
		"path": "../assets/shield-check-CG1nr0ET.js"
	},
	"/assets/sparkles-yQIgrAPM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e3-zVa0zMgzroi6XtzjRsdKWzyFK0k\"",
		"mtime": "2026-08-13T06:21:22.582Z",
		"size": 483,
		"path": "../assets/sparkles-yQIgrAPM.js"
	},
	"/assets/stamp-De9cCejV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"136-lNRc/2DRugxEd32crve+vlxZKoc\"",
		"mtime": "2026-08-13T06:21:22.582Z",
		"size": 310,
		"path": "../assets/stamp-De9cCejV.js"
	},
	"/assets/styles-P7rSzEpM.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"7c8f-Nml6ExBobO+N3IYCQdercUmsplA\"",
		"mtime": "2026-08-13T06:21:22.582Z",
		"size": 31887,
		"path": "../assets/styles-P7rSzEpM.css"
	},
	"/assets/terms-CoZ8ZKSo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a8e-Gg/FjakwErb8UCFRULAl1/Lk/ws\"",
		"mtime": "2026-08-13T06:21:22.582Z",
		"size": 2702,
		"path": "../assets/terms-CoZ8ZKSo.js"
	},
	"/assets/triangle-alert-AEP2XyMQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"16e-+AkGp5gH4XX6r+3d3UGe9JY7uUU\"",
		"mtime": "2026-08-13T06:21:22.582Z",
		"size": 366,
		"path": "../assets/triangle-alert-AEP2XyMQ.js"
	},
	"/assets/workflows-B1OT3fkm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"826-D7El594rvNqQVj9fbAHxIv1SoCY\"",
		"mtime": "2026-08-13T06:21:22.582Z",
		"size": 2086,
		"path": "../assets/workflows-B1OT3fkm.js"
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
