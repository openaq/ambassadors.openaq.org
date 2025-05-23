import { OGImageRoute } from "astro-og-canvas";
import { getCollection } from "astro:content";
import path from "path";

const homepage = await getCollection("homepage");
const ambassadors = await getCollection("ambassadors");
const cohorts = await getCollection("cohorts");
const projects = await getCollection("projects");
const apply = await getCollection("apply");

const homepageContent = homepage.map((page) => {
  return {
    id: page.id,
    title: page.data.title,
    filePath: page.filePath,
    description: "The OpenAQ Community Ambassador Program",
  };
});

const cohortsContent = cohorts.map((cohort) => {
  return {
    id: cohort.id,
    title: cohort.data.year,
    filePath: cohort.filePath,
    description: `Meet the ${cohort.data.year} cohorts.`,
  };
});

const projectsContent = projects.map((project) => {
  return {
    id: project.id,
    title: project.data.title,
    filePath: project.filePath,
    image: project.data.image,
    description: project.data.title,
  };
});

const ambassadorsContent = ambassadors.map((ambassador) => {
  return {
    id: ambassador.id,
    title: ambassador.data.name,
    filePath: ambassador.filePath,
    image: ambassador.data.image,
    description: `${ambassador.data.name} - Ambassador Cohort ${ambassador.data.year}`,
  };
});

const applyContent = apply.map((apply) => {
  return {
    id: apply.id,
    title: apply.data.title,
    description: `Explore the ${apply.data.title}`,
  };
});

interface Image {
    src: string;
    width: number;
    height: number;
    format: "png" | "jpg" | "jpeg" | "tiff" | "webp" | "gif" | "svg" | "avif";
}

interface Collection {
    id: string;
    title: string | number;
    filePath?: string;
    image?: Image;
    description: string;
}

const allCollections: Collection[] = [
  ...ambassadorsContent,
  ...homepageContent,
  ...applyContent,
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
    const logo = "src/assets/logo.png";
    const filename = page.filePath?.includes("people") ? path.basename(page.image!.src).split('.')[0] : ""
    const fileExt = page.filePath?.includes("people") ? path.extname(page.image!.src) : ""
    const imagePath = page.filePath?.includes("people") ? `src/assets/images/${filename}${fileExt}` : logo;
    const imageSize: [number, number] = [280, 280];
    return {
      title: `OpenAQ Community Ambassadors Program`,
      description: page.description,

      bgGradient: [
        [255, 255, 255],
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
      border: { color: [102, 149, 55], width: 40 },
      padding: 40,
    };
  },
});
