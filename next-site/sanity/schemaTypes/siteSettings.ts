import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Paramètres du site',
  type: 'document',
  fields: [
    defineField({
      name: 'contactEmail',
      title: 'Courriel de contact',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'calBookingUrl',
      title: 'Lien Cal.com (appel découverte)',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Lien Instagram',
      type: 'url',
    }),
  ],
  preview: {
    prepare: () => ({title: 'Paramètres du site'}),
  },
})
