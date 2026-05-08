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
      name: 'bookingUrl',
      title: "URL de réservation (CTA principal)",
      description:
        "Tous les CTA du site pointent vers cette URL. Utiliser le lien Cal.com principal d'Éliane.",
      type: 'url',
      initialValue: 'https://cal.com/elianelarre/appel-decouverte',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'calNamespace',
      title: 'Cal.com — Namespace',
      description: 'La partie après /cal.com/ dans le lien, ex: "elianelarre/appel-decouverte"',
      type: 'string',
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
