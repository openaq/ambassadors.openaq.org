import { OGImageRoute } from "astro-og-canvas";
import { getCollection } from "astro:content";

const homepage = await getCollection("homepage");
const ambassadors = await getCollection("ambassadors");
const cohorts = await getCollection("cohorts");
const projects = await getCollection("projects");
const apply = await getCollection("apply");
// const faq = await getCollection("faq");

const homepageContent = homepage.map((page) => {
  return {
    id: page.id,
    title: page.data.title,
    filePath: page.filePath,
    image: "",
    description: "The OpenAQ Community Ambassador Program",
  };
});

const cohortsContent = cohorts.map((cohort) => {
  return {
    id: cohort.id,
    title: cohort.data.year,
    filePath: cohort.filePath,
    image: "",
    description: `Meet the ${cohort.data.year} cohorts.`,
  };
});

const projectsContent = projects.map((project) => {
  return {
    id: project.id,
    title: project.data.title,
    filePath: project.filePath,
    image: project.data.image.src,
    description: project.data.title,
  };
});

const ambassadorsContent = ambassadors.map((ambassador) => {
  return {
    id: ambassador.id,
    title: ambassador.data.name,
    filePath: ambassador.filePath,
    image: ambassador.data.imagePath,
    description: `${ambassador.data.name} - Ambassador Cohort ${ambassador.data.year}`,
  };
});

const applyContent = apply.map((apply) => {
  return {
    id: apply.id,
    title: apply.data.title,
    filePath: apply.filePath,
    image: "",
    description: `Explore the ${apply.data.title}`,
  };
});

// const faqContent = faq.map((faq) => {
//   return {
//     id: faq.id,
//     title: faq.data.title,
//     description: `${faq.data.title}`,
//   };
// });

const allCollections = [
  ...ambassadorsContent,
  ...homepageContent,
  ...applyContent,
  // ...faqContent,
  ...projectsContent,
  ...cohortsContent,
];

const pages = Object.fromEntries(
  allCollections.map(({ id, title, description, filePath, image }) => [
    id,
    { title, description, filePath, image },
  ])
);

export const { getStaticPaths, GET } = OGImageRoute({
  pages,
  param: "slug",
  getImageOptions: (_path, page: (typeof pages)[number]) => {
    const logo = "src/assets/images/logo.png";
    const isPeople = page.filePath?.includes("people");
    const imagePath =
      isPeople && typeof page.image === "string" ? page.image : logo;
    const imageSize: [number, number] = isPeople ? [250, 250] : [150, 100];
    return {
      title: `OpenAQ Community Ambassadors Program`,
      description: page.description,

      bgGradient: [
        [226, 235, 225],
        [226, 235, 225],
      ],

      logo: {
        path: imagePath,
        size: imageSize,
      },

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
      border: { color: [219, 236, 203], width: 40 },
      padding: 60,
    };
  },
});
