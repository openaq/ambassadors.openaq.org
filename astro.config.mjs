// @ts-check
import { defineConfig } from "astro/config";
import { remarkModifiedTime } from "./remark-modified-time.mjs";
import purgecss from "astro-purgecss";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { join } from 'path';
import { minify } from 'html-minifier-next';


function htmlMinifier() {
  return {
    name: 'html-minifier-next',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const distDir = fileURLToPath(dir);
        const files = readdirSync(distDir, { recursive: true, encoding: 'utf-8' })
          .filter(f => f.endsWith('.html'))
          .map(f => join(distDir, f));
        for (const file of files) {
          const minified = await minify(readFileSync(file, 'utf-8'), {
            preset: 'comprehensive'
            // Options: https://github.com/j9t/html-minifier-next?tab=readme-ov-file#options-quick-reference
          });
          writeFileSync(file, minified);
        }
      }
    }
  };
}


// https://astro.build/config
export default defineConfig({
  output: "static",
  integrations: [purgecss(),htmlMinifier()],

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
