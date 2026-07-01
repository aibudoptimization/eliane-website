import {defineType, defineField} from 'sanity'
import {bodyRichBlock} from './portableText'

export default defineType({
  name: 'faq',
  title: 'Question fréquente',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Réponse',
      type: 'array',
      of: [bodyRichBlock(true)],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'order',
      title: "Ordre d'affichage",
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Ordre d'affichage",
      name: 'displayOrder',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
  preview: {
    select: {title: 'question'},
  },
})
