// @ts-check
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import { typst } from "astro-typst";

// Please check `defineConfig/env` in astro.config.mjs for schema
const e = loadEnv(process.env.NODE_ENV || "", process.cwd(), "");
const { SITE, URL_BASE } = e;

// https://astro.build/config
export default defineConfig({
  // Whether to prefetch links while hovering.
  // See: https://docs.astro.build/en/guides/prefetch/
  prefetch: {
    prefetchAll: true,
  },

  site: SITE,
  base: URL_BASE,

  integrations: [
    typst({
      // Always builds HTML files
      mode: {
        default: "html",
        detect: () => "html",
      },
    }),
  ],

  vite: {
    build: {
      assetsInlineLimit(filePath, content) {
        const KB = 1024;
        return content.length < (filePath.endsWith(".css") ? 100 * KB : 4 * KB);
      },
    },
    ssr: {
      external: ["@myriaddreamin/typst-ts-node-compiler"],
      noExternal: ["@fontsource-variable/inter"],
    },
  },
});
