/** Maps Studio sidebar section IDs to homePage schema field groups. */

export type HomePageSection = {
  title: string
  sectionId: string
  group: string | null
}

export const HOME_PAGE_SECTIONS: HomePageSection[] = [
  {title: "Vue d'ensemble", sectionId: 'all', group: null},
  {title: 'Hero', sectionId: 'hero', group: 'hero'},
  {title: 'Bande défilante', sectionId: 'marquees', group: 'marquees'},
  {title: 'Approche', sectionId: 'approche', group: 'sledComparison'},
  {title: 'Rencontre ton entraîneure', sectionId: 'rencontre', group: 'meetTrainer'},
  {title: 'Mon accompagnement', sectionId: 'accompagnement', group: 'offering'},
  {title: 'Pourquoi le présentiel', sectionId: 'presentiel', group: 'inPerson'},
  {title: 'Leur expérience', sectionId: 'temoignages', group: 'reviews'},
  {title: 'Pour toi ou pas ?', sectionId: 'pour-toi', group: 'forYouOrNot'},
  {title: "Après l'appel", sectionId: 'apres-appel', group: 'afterCall'},
  {title: 'Bande mauve CTA', sectionId: 'cta-mauve', group: 'purpleCta'},
  {title: 'Intro FAQ', sectionId: 'faq', group: 'faqIntro'},
  {title: 'Collaborateurs', sectionId: 'collaborateurs', group: 'collaborators'},
]

const SECTION_ID_TO_GROUP = Object.fromEntries(
  HOME_PAGE_SECTIONS.filter((s) => s.group).map((s) => [s.sectionId, s.group!]),
) as Record<string, string>

/** Read active section from Studio structure URL (`section-{id}` segments). */
export function resolveHomePageGroupFromLocation(pathname?: string): string | null {
  const path = pathname ?? (typeof window !== 'undefined' ? window.location.pathname : '')
  const matches = [...path.matchAll(/section-([a-z0-9-]+)/gi)]

  // Nested hubs (e.g. section-faq-group → section-faq) — use deepest known shortcut.
  for (let i = matches.length - 1; i >= 0; i--) {
    const sectionId = matches[i][1]
    if (sectionId === 'all') return null
    const group = SECTION_ID_TO_GROUP[sectionId]
    if (group) return group
  }

  return null
}
