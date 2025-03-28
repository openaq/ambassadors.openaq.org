import { defineCollection, z } from "astro:content";

import { glob } from "astro/loaders";
import { ISO_A2 } from './utils/constants'

const [isoCode, ...isoCodes] = Object.keys(ISO_A2)

const ambassadors = defineCollection({
  loader: glob({ pattern: ["*.md"], base: "src/content/people/ambassadors" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      country_iso: z.enum([isoCode, ...isoCodes]).optional(),
      year: z.number().refine((x) => x > 2020 && x < 2030, {
        message: "Must be a valid year",
      }),
      timestamp:  z.string().time(),
      presentation: z.string(),
      email: z.string().email().optional(),
      image: image(),
      bluesky: z.string().url().optional(),
      linkedin: z.string().url().optional(),
      github: z.string().url().optional(),
      x: z.string().url().optional(),
      mastadon: z.string().url().optional(),
      orcid: z.string().url().optional(),
      researchGate: z.string().url().optional(),
      googleScholar: z.string().url().optional(),
    }),
});


const cohorts = defineCollection({
    loader: glob({ pattern: ["*.md"], base: "src/content/cohorts" }),
    schema: () =>
      z.object({
        year: z.number().refine((x) => x > 2020 && x < 2030, {
          message: "Must be a valid year",
        }),
        youtube_url: z.string().url(),
      }),
  });

  const partners = defineCollection({
    loader: glob({ pattern: ["*.md"], base: "src/content/partners" }),
    schema: ({ image }) =>
      z.object({
        name: z.string(),
        url: z.string().url(),
        image: image()
      }),
  });

export const collections = {
    ambassadors,
    cohorts,
    partners
};
