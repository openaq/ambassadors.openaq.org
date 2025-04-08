// @ts-check
import { defineConfig } from "astro/config";
import { remarkModifiedTime } from "./remark-modified-time.mjs";

// https://astro.build/config
export default defineConfig({
  output: "static",
  experimental: {
    svg: true,
    responsiveImages: true,
  },

  markdown: {
    remarkPlugins: [remarkModifiedTime],
  },
  site: 'https://openaq.github.io',
  base: 'ambassadors.openaq.org',
});
