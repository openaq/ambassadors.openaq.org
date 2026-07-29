import worldData from '@assets/data/countries_110m.json';
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { geoEqualEarth, geoPath, type GeoSphere } from 'd3';
import { Buffer } from 'node:buffer';

import sharp from 'sharp';

const world = worldData as unknown as FeatureCollection<
  Geometry,
  GeoJsonProperties
>;

const projection = geoEqualEarth();
const path = geoPath(projection);

const outline: GeoSphere = { type: 'Sphere' };
const [[x0, y0], [x1, y1]] = geoPath(projection.fitWidth(200, outline)).bounds(
  outline,
);
const height = Math.ceil(y1 - y0);
const l = Math.min(Math.ceil(x1 - x0), height);
projection.scale((projection.scale() * (l - 1)) / l).precision(0.2);
const ambassadors = await getCollection('ambassadors');
const allIsoCodes = ambassadors.map((ambassador) => {
  return ambassador.data.countryIso;
});
let cohortLookups = new Map();
cohortLookups.set('all', allIsoCodes);
const cohorts = await getCollection('cohorts');
for (const cohort of cohorts) {
  const people = ambassadors.filter((o) => o.data.year === cohort.data.year);
  const isoCodes = people.map((ambassador) => {
    return ambassador.data.countryIso;
  });
  cohortLookups.set(String(cohort.data.year), isoCodes);
}

export const GET: APIRoute = async ({ params }) => {
  const id = params.id;
  const isoCodes = cohortLookups.get(id);

  const paths = world.features.map((o) => {
    return `<path d="${path(o.geometry)}" fill="${
      isoCodes.includes(o.properties?.ISO_A2) ? '#6a5cd8' : '#fff'
    }" stroke="${
      isoCodes.includes(o.properties?.ISO_A2) ? '#fff' : '#d4d8dd'
    }" stroke-width="0.1"></path>`;
  });

  const globe = `<path d="${path({ type: 'Sphere' })}" fill="#b0e8e6" stroke="none"></path>`;

  const svg = `<svg viewBox="0 0 200 ${height}">
    ${globe}
    ${paths}
   </svg>`;
  const buffer = Buffer.from(svg);
  const webp = await sharp(buffer)
    .resize(600, 294)
    .webp({ quality: 90, effort: 6, nearLossless: true })
    .toBuffer();
  return new Response(new Uint8Array(webp), {
    headers: { 'Content-Type': 'image/webp' },
  });
};

export function getStaticPaths() {
  return Array.from(cohortLookups.keys()).map((o) => {
    return { params: { id: o } };
  });
}
import worldData from '@assets/data/countries_110m.json';
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

import { getCollection } from 'astro:content';
import { geoEqualEarth, geoPath, type GeoSphere } from 'd3';
import { Buffer } from 'node:buffer';
import type { APIRoute } from 'astro';

import sharp from 'sharp';

const world = worldData as unknown as FeatureCollection<Geometry, GeoJsonProperties>;

const projection = geoEqualEarth();
const path = geoPath(projection);

const outline: GeoSphere = { type: 'Sphere' };
const [[x0, y0], [x1, y1]] = geoPath(projection.fitWidth(200, outline)).bounds(
  outline
);
const height = Math.ceil(y1 - y0);
const l = Math.min(Math.ceil(x1 - x0), height);
projection.scale((projection.scale() * (l - 1)) / l).precision(0.2);

const ISLAND_ISO_CODES = new Set([
  'MV',
  'TT',
]);

const ambassadors = await getCollection('ambassadors');
const allIsoCodes = ambassadors.map((ambassador) => {
  return ambassador.data.countryIso;
});
let cohortLookups = new Map();
cohortLookups.set('all', allIsoCodes);
const cohorts = await getCollection('cohorts');
for (const cohort of cohorts) {
  const people = ambassadors.filter((o) => o.data.year === cohort.data.year);
  const isoCodes = people.map((ambassador) => {
    return ambassador.data.countryIso;
  });
  cohortLookups.set(String(cohort.data.year), isoCodes);
}

export const GET: APIRoute = async ({ params }) => {
  const id = params.id;
  const isoCodes = cohortLookups.get(id);

  const markers: string[] = [];

  const PIN_PATH =
    'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5z';
  const PIN_TIP_X = 12;
  const PIN_TIP_Y = 22;

  const paths = world.features.map((o) => {
    const isHighlighted = isoCodes.includes(o.properties?.ISO_A2);
    const iso = o.properties?.ISO_A2;

    if (isHighlighted && ISLAND_ISO_CODES.has(iso)) {
     const area = path.area(o.geometry);
       const centroid = path.centroid(o.geometry);
       if (centroid.every((n) => Number.isFinite(n))) {
          const [cx, cy] = centroid;
          const scale = 0.25;
          const tx = cx - PIN_TIP_X * scale;
          const ty = cy - PIN_TIP_Y * scale;
          markers.push(
            `<path d="${PIN_PATH}" fill="#6a5cd8" stroke="#fff" stroke-width="0.6" transform="translate(${tx}, ${ty}) scale(${scale})"></path>`
          );
      }
    }

    return `<path d="${path(o.geometry)}" fill="${
      isHighlighted ? '#6a5cd8' : '#fff'
    }" stroke="${isHighlighted ? '#fff' : '#d4d8dd'
}" stroke-width="0.1"></path>`;
  });

  const globe = `<path d="${path(({type: "Sphere"}))}" fill="#b0e8e6" stroke="none"></path>`;

  const svg = `<svg viewBox="0 0 200 ${height}">
    ${globe}
    ${paths.join('')}
    ${markers.join('')}
   </svg>`;
  const buffer = Buffer.from(svg);
  const webp = await sharp(buffer)
    .resize(600, 294)
    .webp({ quality: 90, effort: 6, nearLossless: true })
    .toBuffer();
  return new Response(new Uint8Array(webp), {
    headers: { 'Content-Type': 'image/webp' },
  });
}
export function getStaticPaths() {
  return Array.from(cohortLookups.keys()).map((o) => {
      return { params: { id: o } };
    });
}
