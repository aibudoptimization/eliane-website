import type {Rule} from 'sanity'

/** Portable-text link annotation (FAQ answers, meet-trainer body, etc.). */
export const linkMark = {
  name: 'link',
  type: 'object' as const,
  title: 'Lien',
  fields: [
    {
      name: 'href',
      type: 'url' as const,
      title: 'URL',
      validation: (r: Rule) => r.required(),
    },
    {
      name: 'openInNewTab',
      type: 'boolean' as const,
      title: 'Ouvrir dans un nouvel onglet',
      initialValue: true,
    },
  ],
}
