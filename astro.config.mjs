// @ts-check
import { defineConfig } from "astro/config";
import { remarkModifiedTime } from "./remark-modified-time.mjs";
import purgecss from "astro-purgecss";

// https://astro.build/config
export default defineConfig({
  build: {
    inlineStylesheets: "never",
  },
  output: "static",
  experimental: {
    svg: true,
    responsiveImages: true,
  },
  integrations: [purgecss()],

  markdown: {
    remarkPlugins: [remarkModifiedTime],
  },
  site: "https://openaq.github.io",
  base: "ambassadors.openaq.org",
});
