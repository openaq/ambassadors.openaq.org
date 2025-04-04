import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import { render } from "astro:content";

export async function GET() {
  const siteUrl = import.meta.env.SITE;

  const homepage = await getCollection("homepage");
  const ambassadors = await getCollection("ambassadors");
  const cohorts = await getCollection("cohorts");
  const projects = await getCollection("projects");
  const forms = await getCollection("forms");
  const apply = await getCollection("apply");
  const faq = await getCollection("faq");

  type CollectionName =
    | "homepage"
    | "ambassadors"
    | "cohorts"
    | "projects"
    | "forms"
    | "apply"
    | "faq";

  const routes = {
    homepage: [],
    ambassadors: ["people"],
    cohorts: ["cohorts"],
    projects: ["projects"],
    forms: ["apply", "forms"],
    apply: ["apply"],
    faq: ["apply"],
  };

  const getRoute = (collection: CollectionName): string[] => {
    return routes[collection];
  };

  const entryMap = async (entry: CollectionEntry<CollectionName>) => {
    const { remarkPluginFrontmatter } = await render(entry);
    const { collection, id } = entry;
    const { lastModified } = remarkPluginFrontmatter;
    return {
      slug: id,
      lastModified,
      route: getRoute(collection),
    };
  };

  const homepageEntries = await Promise.all(homepage.map(entryMap));
  const ambassadorEntries = await Promise.all(ambassadors.map(entryMap));
  const cohortsEntries = await Promise.all(cohorts.map(entryMap));
  const projectsEntries = await Promise.all(projects.map(entryMap));
  const formsEntries = await Promise.all(forms.map(entryMap));
  const applyEntries = await Promise.all(apply.map(entryMap));
  const faqEntries = await Promise.all(faq.map(entryMap));
  
  const buildPath = (paths: string[], slug: string) => {
    const fullPath = [...paths, slug].join("/");

    const url = new URL(fullPath, siteUrl);
    return url;
  };

  const buildUrlEntry = ({
    lastModified,
    slug,
    route,
  }: {
    lastModified: string;
    slug?: string;
    route?: string[];
  }) => {
    if (!slug || !route) return;

    const url = buildPath(route, slug);

    return `<url>
    <loc>${url.href}</loc>
  
    ${
      lastModified
        ? `<lastmod>${new Date(lastModified).toISOString()}</lastmod>`
        : `<lastmod>No latest modified date found</lastmod>`
    }
    </url>`;
  };

  const result = `
      <?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url><loc>${siteUrl}</loc></url>

${homepageEntries.map(buildUrlEntry).join("\n")}
${ambassadorEntries.map(buildUrlEntry).join("\n")}
${cohortsEntries.map(buildUrlEntry).join("\n")}
${projectsEntries.map(buildUrlEntry).join("\n")}
${formsEntries.map(buildUrlEntry).join("\n")}
${applyEntries.map(buildUrlEntry).join("\n")}
${faqEntries.map(buildUrlEntry).join("\n")}


  </urlset>  `.trim();

  return new Response(result, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
