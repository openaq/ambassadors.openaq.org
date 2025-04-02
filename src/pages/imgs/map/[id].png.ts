import world from '@assets/data/countries_110m.json';
import { getCollection } from 'astro:content';
import { geoEqualEarth, geoPath } from 'd3';
import { Buffer } from 'node:buffer';

import sharp from 'sharp';

const projection = geoEqualEarth();
const path = geoPath(projection);

const outline = { type: 'Sphere' };
const [[x0, y0], [x1, y1]] = geoPath(projection.fitWidth(200, outline)).bounds(
  outline
);
const height = Math.ceil(y1 - y0);
const l = Math.min(Math.ceil(x1 - x0), height);
projection.scale((projection.scale() * (l - 1)) / l).precision(0.2);
const ambassadors = await getCollection('ambassadors');
const allIsoCodes = ambassadors.map((ambassador) => {
  return ambassador.data.country_iso;
});
let cohortLookups = new Map();
cohortLookups.set('all', allIsoCodes);
const cohorts = await getCollection('cohorts');
for (const cohort of cohorts) {
  const people = ambassadors.filter((o) => o.data.year === cohort.data.year);
  const isoCodes = people.map((ambassador) => {
    return ambassador.data.country_iso;
  });
  cohortLookups.set(String(cohort.data.year), isoCodes);
}

export async function GET({ params, request }) {
  const id = params.id;
  const isoCodes = cohortLookups.get(id);

  const paths = world.features.map((o) => {
    return `<path d="${path(o.geometry)}" fill="${
      isoCodes.includes(o.properties.ISO_A2) ? '#6a5cd8' : '#d4d8dc'
    }" stroke="#fff" stroke-width="0.1"></path>`;
  });

  const svg = `<svg viewBox="0 0 200 ${height}">
    ${paths}
   </svg>`;
  const buffer = Buffer.from(svg);
  const png = await sharp(buffer)
    .resize(1400, 686)
    .png({ quality: 100 })
    .toBuffer();
  return new Response(png);
}

export function getStaticPaths() {
  return [
    ...Array.from(cohortLookups.keys()).map((o) => {
      return { params: { id: o } };
    }),
  ];
}
