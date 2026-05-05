import {defineType, defineField} from 'sanity'
import {linkMark} from './linkMark'

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
      of: [
        {
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [
            {title: 'Liste à puces', value: 'bullet'},
            {title: 'Liste numérotée', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Gras', value: 'strong'},
              {title: 'Italique', value: 'em'},
            ],
            annotations: [linkMark],
          },
        },
      ],
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
