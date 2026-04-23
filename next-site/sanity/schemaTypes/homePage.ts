import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Page d\'accueil',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Section Hero'},
    {name: 'intro', title: 'Introduction'},
    {name: 'approach', title: 'Mon approche'},
    {name: 'freeWeights', title: 'Poids libres'},
    {name: 'contact', title: 'Contact'},
  ],
  fields: [
    // HERO
    defineField({
      name: 'heroHeadline',
      title: 'Titre principal',
      description: 'Utilise le bouton Italique pour mettre un bout de phrase en évidence.',
      type: 'array',
      group: 'hero',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
          marks: {
            decorators: [
              { title: 'Italique', value: 'em' },
              { title: 'Gras', value: 'strong' },
            ],
            annotations: [],
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroSubheadline',
      title: 'Sous-titre',
      type: 'text',
      rows: 3,
      group: 'hero',
    }),
    defineField({
      name: 'heroImage',
      title: 'Photo principale',
      type: 'image',
      options: {hotspot: true},
      fields: [
        {name: 'alt', type: 'string', title: 'Texte alternatif (accessibilité)'},
      ],
      group: 'hero',
      validation: (Rule) => Rule.required(),
    }),

    // INTRO
    defineField({
      name: 'introHeadline',
      title: 'Titre',
      description: 'Utilise le bouton Italique pour mettre un bout de phrase en évidence.',
      type: 'array',
      group: 'intro',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
          marks: {
            decorators: [
              { title: 'Italique', value: 'em' },
              { title: 'Gras', value: 'strong' },
            ],
            annotations: [],
          },
        },
      ],
    }),
    defineField({
      name: 'introDescription',
      title: 'Description',
      type: 'text',
      rows: 4,
      group: 'intro',
    }),
    defineField({
      name: 'introImage',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        {name: 'alt', type: 'string', title: 'Texte alternatif'},
      ],
      group: 'intro',
    }),

    // APPROACH
    defineField({
      name: 'approachHeadline',
      title: 'Titre',
      description: 'Utilise le bouton Italique pour mettre un bout de phrase en évidence.',
      type: 'array',
      group: 'approach',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
          marks: {
            decorators: [
              { title: 'Italique', value: 'em' },
              { title: 'Gras', value: 'strong' },
            ],
            annotations: [],
          },
        },
      ],
    }),
    defineField({
      name: 'approachDescription',
      title: 'Description',
      type: 'text',
      rows: 5,
      group: 'approach',
    }),
    defineField({
      name: 'approachImage',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        {name: 'alt', type: 'string', title: 'Texte alternatif'},
      ],
      group: 'approach',
    }),

    // FREE WEIGHTS
    defineField({
      name: 'freeWeightsHeadline',
      title: 'Titre',
      description: 'Utilise le bouton Italique pour mettre un bout de phrase en évidence.',
      type: 'array',
      group: 'freeWeights',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
          marks: {
            decorators: [
              { title: 'Italique', value: 'em' },
              { title: 'Gras', value: 'strong' },
            ],
            annotations: [],
          },
        },
      ],
    }),
    defineField({
      name: 'freeWeightsBullets',
      title: 'Points (avantages)',
      description: 'Chaque point peut contenir un mot en gras au début (ex: accessibles, travaillent).',
      type: 'array',
      group: 'freeWeights',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
          marks: {
            decorators: [
              { title: 'Gras', value: 'strong' },
              { title: 'Italique', value: 'em' },
            ],
            annotations: [],
          },
        },
      ],
    }),
    defineField({
      name: 'freeWeightsImage',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        {name: 'alt', type: 'string', title: 'Texte alternatif'},
      ],
      group: 'freeWeights',
    }),

    // CONTACT
    defineField({
      name: 'contactHeadline',
      title: 'Titre section contact',
      type: 'text',
      rows: 2,
      group: 'contact',
    }),
    defineField({
      name: 'contactDescription',
      title: 'Description',
      type: 'text',
      rows: 3,
      group: 'contact',
    }),
  ],
  preview: {
    prepare: () => ({title: 'Page d\'accueil'}),
  },
})
