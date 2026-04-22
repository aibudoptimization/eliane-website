import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'offer',
  title: 'Offre',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nom de l\'offre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (pour l\'URL)',
      type: 'slug',
      options: {source: 'title'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Durée (ex: "1 mois", "3 mois")',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description courte',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'features',
      title: 'Ce qui est inclus',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'idealFor',
      title: 'Idéale si tu…',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'isPopular',
      title: 'Afficher le badge "Populaire"',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Ordre d\'affichage',
      description: 'Plus petit = affiché en premier',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
  ],
  orderings: [
    {
      title: 'Ordre d\'affichage',
      name: 'displayOrder',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
  preview: {
    select: {title: 'title', subtitle: 'duration'},
  },
})