import { defineCollection, z } from "astro:content";

import { glob } from "astro/loaders";
import { ISO_A2 } from "./utils/constants";

const [isoCode, ...isoCodes] = Object.keys(ISO_A2);

const ambassadors = defineCollection({
  loader: glob({ pattern: ["*.md"], base: "src/content/people/ambassadors" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      countryIso: z.enum([isoCode, ...isoCodes]),
      year: z.number().refine((x) => x > 2020 && x < 2030, {
        error: "Must be a valid year",
      }),
      timestamp: z.number().optional(),
      presentation: z.string(),
      email: z.email().optional(),
      image: image(),
      bluesky: z.url().optional(),
      linkedin: z.url().optional(),
      github: z.url().optional(),
      x: z.url().optional(),
      mastadon: z.url().optional(),
      orcid: z.url().optional(),
      researchGate: z.url().optional(),
      googleScholar: z.url().optional(),
      imagePath: z.string().optional(),
    }),
});

const cohorts = defineCollection({
  loader: glob({ pattern: ["*.md"], base: "src/content/cohorts" }),
  schema: () =>
    z.object({
      year: z.number().refine((x) => x > 2020 && x < 2030, {
        error: "Must be a valid year",
      }),
      youtubeId: z.string().optional(),
    }),
});

const partners = defineCollection({
  loader: glob({ pattern: ["*.md"], base: "src/content/partners" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      url: z.url(),
      image: image(),
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: ["*.md"], base: "src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      cardTitle: z.string(),
      name: z.string(),
      ambassadorSlug: z.string(),
      location: z.string(),
      year: z.number().refine((x) => x > 2020 && x < 2030, {
        error: "Must be a valid year",
      }),
      image: image(),
      youtubeLink: z.url().optional(),
      shortDescription: z.string().optional(),
    }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: ["*.md"], base: "src/content/testimonials" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      image: image(),
    }),
});

const forms = defineCollection({
  loader: glob({ pattern: ["*.md"], base: "src/content/apply/forms" }),
  schema: () =>
    z.object({
      active: z.boolean(),
      jotformId: z.string().optional(),
    }),
});

const apply = defineCollection({
  loader: glob({ pattern: ["about.md"], base: "src/content/apply" }),
  schema: () =>
    z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      application_deadline: z.date(),
      application_open_date: z.date()
    }),
});

const faq = defineCollection({
  loader: glob({ pattern: ["faq.md"], base: "src/content/apply" }),
  schema: () =>
    z.object({
      title: z.string(),
    }),
});

const homepage = defineCollection({
  loader: glob({ pattern: ["index.md"], base: "src/content/" }),
  schema: () =>
    z.object({
      title: z.string(),
    }),
});

const miniCards = defineCollection({
  loader: glob({ pattern: ["*.md"], base: "src/content/miniCards" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      image: image(),
    }),
});

const impacts = defineCollection({
  loader: glob({ pattern: ["*.md"], base: "src/content/impacts" }),
  schema: () => z.object({}),
});

const involvedCards = defineCollection({
  loader: glob({ pattern: ["*.md"], base: "src/content/involvedCards" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      buttonText: z.string().optional(),
      buttonLink: z.string(),
      image: image(),
    }),
});

const engagements = defineCollection({
  loader: glob({ pattern: ["*.md"], base: "src/content/engagements" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      buttonText: z.string().optional(),
      buttonLink: z.string().optional(),
      standardText: z.string().optional(),
      highlightedText: z.string().optional(),
      image: image(),
    }),
});

const preparation = defineCollection({
  loader: glob({ pattern: ["*.md"], base: "src/content/apply" }),
  schema: () =>
    z.object({
      title: z.string(),
    }),
});

export const collections = {
  ambassadors,
  cohorts,
  partners,
  projects,
  testimonials,
  forms,
  apply,
  faq,
  homepage,
  miniCards,
  impacts,
  involvedCards,
  engagements,
  preparation,
};
