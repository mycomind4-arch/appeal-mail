import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HeadContent, Outlet, Scripts, createRootRouteWithContext, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Home, ArrowRight, Scale } from "lucide-react";
import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Appeal Mail — Appeal denied claims and decisions with confidence" },
      { name: "description", content: "Guided workflows to prepare, review, send, and track appeals for denied claims, government decisions, court rulings, and reconsideration requests. Physical mail with proof of delivery. Not a law firm — you control the facts." },
      { name: "robots", content: "index,follow" },
      { name: "theme-color", content: "#312e81" },
      { property: "og:title", content: "Appeal Mail — Appeal denied claims and decisions with confidence" },
      { property: "og:description", content: "Prepare, review, send, track, and keep a record of your appeals." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Appeal Mail" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Appeal Mail — Prepare and send appeals for denied claims and decisions" },
      { name: "twitter:description", content: "Guided workflows, physical mail with tracking, and proof of delivery." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  notFoundComponent: NotFoundPage,
  shellComponent: RootShell,
  component: RootComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}

function NotFoundPage() {
  return (
    <main className="min-h-screen bg-cream">
      <SiteHeader />
      <section className="py-20 md:py-32">
        <div className="container max-w-lg text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl" style={{ background: "color-mix(in oklab, var(--stamp) 10%, transparent)" }}>
            <Scale size={36} className="text-stamp" />
          </div>
          <h1 className="mt-8 text-6xl" style={{ fontFamily: "var(--font-serif)" }}>404</h1>
          <h2 className="mt-2 text-xl font-semibold text-ink-soft">This ruling is being appealed elsewhere</h2>
          <p className="mt-3 text-sm text-muted-foreground">The page you're looking for doesn't exist or has moved. Let's get you back on track.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/" className="btn-primary"><Home size={16} /> Back to home</Link>
            <Link to="/workflows/denied-claim" className="btn-amber">Start an appeal <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
