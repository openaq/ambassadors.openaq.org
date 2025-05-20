// @ts-check
import { defineConfig } from "astro/config";
import { remarkModifiedTime } from "./remark-modified-time.mjs";
import purgecss from "astro-purgecss";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";

// https://astro.build/config
export default defineConfig({
  output: "static",
  integrations: [purgecss()],

  markdown: {
    remarkPlugins: [remarkModifiedTime],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "prepend",
          properties: { className: ["anchor-link"] },
        },
      ],
    ],
  },
  site: "https://ambassadors.openaq.org",
});
