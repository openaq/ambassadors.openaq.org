// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    output: "static",
    experimental: {
        svg: true,
        responsiveImages: true
      },
});
