import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'homepageOffers',
  title: 'Offres du site',
  type: 'document',
  groups: [
    {name: 'tremplin', title: 'Le Tremplin'},
    {name: 'signature', title: 'Offre signature'},
  ],
  fields: [
    // === LE TREMPLIN ===
    defineField({
      name: 'tremplinDurationBadge',
      title: 'Badge (durée)',
      description: 'Ex: "1 mois"',
      type: 'string',
      group: 'tremplin',
    }),
    defineField({
      name: 'tremplinTitle',
      title: "Titre de l'offre",
      type: 'string',
      group: 'tremplin',
    }),
    defineField({
      name: 'tremplinDuration',
      title: 'Durée affichée',
      description: 'Ex: "1 mois"',
      type: 'string',
      group: 'tremplin',
    }),
    defineField({
      name: 'tremplinPitch',
      title: 'Phrase d\'accroche',
      type: 'text',
      rows: 2,
      group: 'tremplin',
    }),
    defineField({
      name: 'tremplinFeatures',
      title: 'Ce qui est inclus',
      description: 'Liste à puces',
      type: 'array',
      of: [{type: 'string'}],
      group: 'tremplin',
    }),
    defineField({
      name: 'tremplinIdealFor',
      title: 'Idéale si tu…',
      type: 'text',
      rows: 2,
      group: 'tremplin',
    }),
    defineField({
      name: 'tremplinLink',
      title: "Page détaillée de l'offre",
      description:
        "Sélectionne la page d'offre Le Tremplin. Le lien 'En savoir plus' pointera automatiquement vers cette page.",
      type: 'reference',
      to: [{type: 'offerPage'}],
      group: 'tremplin',
    }),

    // === OFFRE SIGNATURE ===
    defineField({
      name: 'signatureDurationBadge',
      title: 'Badge (durée ou étiquette)',
      description: 'Ex: "3 mois" ou "Populaire"',
      type: 'string',
      group: 'signature',
    }),
    defineField({
      name: 'signatureShowPopularBadge',
      title: 'Afficher le badge "Populaire"',
      description: 'Affiche le badge Populaire au coin de la carte',
      type: 'boolean',
      group: 'signature',
      initialValue: true,
    }),
    defineField({
      name: 'signatureTitle',
      title: "Titre de l'offre",
      type: 'string',
      group: 'signature',
    }),
    defineField({
      name: 'signatureDuration',
      title: 'Durée affichée',
      description: 'Ex: "3 mois"',
      type: 'string',
      group: 'signature',
    }),
    defineField({
      name: 'signaturePitch',
      title: "Phrase d'accroche",
      type: 'text',
      rows: 2,
      group: 'signature',
    }),
    defineField({
      name: 'signatureFeatures',
      title: 'Ce qui est inclus',
      description: 'Liste à puces',
      type: 'array',
      of: [{type: 'string'}],
      group: 'signature',
    }),
    defineField({
      name: 'signatureIdealFor',
      title: 'Idéale si tu…',
      type: 'text',
      rows: 2,
      group: 'signature',
    }),
    defineField({
      name: 'signatureLink',
      title: "Page détaillée de l'offre",
      description:
        "Sélectionne la page d'offre Offre signature. Le lien 'En savoir plus' pointera automatiquement vers cette page.",
      type: 'reference',
      to: [{type: 'offerPage'}],
      group: 'signature',
    }),
  ],
  preview: {
    prepare: () => ({title: 'Offres du site'}),
  },
})
