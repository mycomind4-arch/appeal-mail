import { defineConfig } from "@lovable.dev/vite-tanstack-config";
export default defineConfig({
  tanstackStart: { server: { entry: "server" } },
  nitro: { preset: "cloudflare-pages", cloudflare: { pages: { name: "appeal-mail" } } },
});
