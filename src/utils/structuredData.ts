import type { ImageObject, Person, WithContext } from 'schema-dts';
import type { CollectionEntry } from 'astro:content';

export interface SocialsDefinition {
  x: string | undefined,
  mastadon: string | undefined,
  linkedin: string | undefined,
  github: string | undefined,
  orcid: string | undefined,
  researchGate: string | undefined,
  googleScholar: string | undefined,
  bluesky: string | undefined,
}

export function personStructuredData(
  socials: SocialsDefinition,
  ambassador: CollectionEntry<'ambassadors'>
): WithContext<Person>  {
  const socialsValues: Array<string | undefined> = Object.values(socials)
  const socialsLinks = socialsValues.filter(
    (o) => o !== undefined
  );

  const data: WithContext<Person> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: ambassador.data.name,
    image: ambassador.data.image.src
  };
  if (socialsLinks.length) {
    data["sameAs"] = [...socialsLinks]
  }
  return data;
}
