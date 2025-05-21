import { OGImageRoute } from "astro-og-canvas";
import { getCollection } from "astro:content";

  const homepage = await getCollection("homepage");
  const ambassadors = await getCollection("ambassadors");
  const cohorts = await getCollection("cohorts");
  const projects = await getCollection("projects");
  const apply = await getCollection("apply");
  const faq = await getCollection("faq");

const homepageContent = homepage.map((page) => {
  return {
    id: page.id,
    title: page.data.title,
    description: "The OpenAQ Community Ambassador Program",
  };
});

const cohortsContent = cohorts.map((cohort) => {
  return {
    id: cohort.id,
    title: cohort.data.year,
    description:
      `Meet the ${cohort.data.year} cohorts.`,
  };
});

const projectsContent = projects.map((project) => {
  return {
    id: project.id,
    title: project.data.title,
    description: project.data.title,
  };
});

const ambassadorsContent = ambassadors.map((ambassador) => {
  return {
    id: ambassador.id,
    title: ambassador.data.name,
    description: `${ambassador.data.name} - ${ambassador.data.year}`,
  };
});


const applyContent = apply.map((apply) => {
  return {
    id: apply.id,
    title: apply.data.title,
    description: `Explore the OpenAQ usecase: "${apply.data.title}"`,
  };
});

const faqContent = faq.map((faq) => {
  return {
    id: faq.id,
    title: faq.data.title,
    description: `Explore OpenAQ's "${faq.data.title}"`,
  };
});

const allCollections = [
  ...ambassadorsContent,
  ...homepageContent,
  ...applyContent,
  ...faqContent,
  ...projectsContent,
  ...cohortsContent,
];

const pages = Object.fromEntries(
  allCollections.map(({ id, title, description }) => [
    id,
    { title, description },
  ])
);

export const { getStaticPaths, GET } = OGImageRoute({
  pages,
  param: "slug",
  getImageOptions: (_path, page: (typeof pages)[number]) => {
    return {
      title: `OpenAQ`,
      description: page.description,
      bgGradient: [
        [226, 235, 225],
        [226, 235, 225],
      ],
      fonts: ["src/assets/fonts/SpaceGrotesk-Medium.ttf"],
      font: {
        title: {
          color: [0, 0, 0],
          size: 55,
          families: ["Space Grotesk"],
          lineHeight: 1.3,
        },
        description: {
          color: [0, 0, 0],
          size: 35,
          families: ["Space Grotesk"],
          lineHeight: 1.3,
        },
      },
      logo: {
        path: "./src/assets/logo.svg",
      },
      border: { color: [219, 236, 203], width: 40 },
      padding: 40,
    };
  },
});
