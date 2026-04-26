import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'offerPage',
  title: "Page d'offre",
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero'},
    {name: 'idealList', title: 'Pour qui'},
    {name: 'includes', title: "Ce que comprend l'offre"},
    {name: 'forYou', title: 'Tu te reconnais ?'},
    {name: 'comparison', title: 'Comparaison'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: "Nom de l'offre",
      description: 'Ex: "Le Tremplin"',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug URL',
      description:
        "Génère automatiquement depuis le titre. Ce sera la fin de l'URL: /offres/VOTRE-SLUG",
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    // === HERO ===
    defineField({
      name: 'heroEyebrow',
      title: 'Eyebrow (surtitre)',
      description: 'Ex: "Formule 1 mois"',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Sous-titre (italique)',
      description: 'Phrase courte en italique sous le titre.',
      type: 'array',
      group: 'hero',
      of: [
        {
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [],
          marks: {
            decorators: [
              {title: 'Italique', value: 'em'},
              {title: 'Gras', value: 'strong'},
            ],
            annotations: [],
          },
        },
      ],
    }),
    defineField({
      name: 'heroPitch',
      title: 'Texte descriptif',
      description: "Paragraphe de présentation de l'offre.",
      type: 'text',
      rows: 6,
      group: 'hero',
    }),

    // === IDEAL LIST (Pour qui) ===
    defineField({
      name: 'idealListHeading',
      title: 'Titre de la section',
      description: 'Ex: "Cette offre est idéale si tu veux…"',
      type: 'string',
      group: 'idealList',
    }),
    defineField({
      name: 'idealListItems',
      title: 'Points',
      description: 'Liste à puces',
      type: 'array',
      of: [{type: 'string'}],
      group: 'idealList',
    }),

    // === INCLUDES (Ce que comprend l'offre) ===
    defineField({
      name: 'includesHeading',
      title: 'Titre de la section',
      description: "Ex: \"Ce que comprend l'offre\"",
      type: 'string',
      group: 'includes',
    }),
    defineField({
      name: 'processCards',
      title: 'Cartes du processus',
      description: 'Les 4 cartes numérotées. Doit contenir exactement 4 cartes.',
      type: 'array',
      group: 'includes',
      validation: (Rule) => Rule.length(4).error('Il faut exactement 4 cartes.'),
      of: [
        {
          type: 'object',
          title: 'Carte',
          fields: [
            {
              name: 'kicker',
              title: 'Étiquette (kicker)',
              description: 'Ex: "La rencontre"',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'title',
              title: 'Titre de la carte',
              description: 'Ex: "Rencontre initiale"',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'items',
              title: 'Points',
              description: 'Liste à puces sous le titre',
              type: 'array',
              of: [{type: 'string'}],
              validation: (Rule) => Rule.min(1),
            },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'kicker',
            },
          },
        },
      ],
    }),

    // === FOR YOU (Tu te reconnais ?) ===
    defineField({
      name: 'forYouHeading',
      title: 'Titre de la section',
      description: 'Ex: "Cette offre est pour toi si…"',
      type: 'string',
      group: 'forYou',
    }),
    defineField({
      name: 'forYouItems',
      title: 'Points',
      description: 'Liste à puces',
      type: 'array',
      of: [{type: 'string'}],
      group: 'forYou',
    }),

    // === COMPARISON ===
    defineField({
      name: 'comparisonDuration',
      title: 'Durée (affichée dans la comparaison)',
      description: 'Ex: "1 mois"',
      type: 'string',
      group: 'comparison',
    }),
    defineField({
      name: 'comparisonBullets',
      title: 'Points de comparaison',
      description:
        'Les points qui décrivent cette offre dans la section "Comparer les deux offres".',
      type: 'array',
      of: [{type: 'string'}],
      group: 'comparison',
    }),
    defineField({
      name: 'otherOffer',
      title: "Lien vers l'autre offre",
      description: "L'autre offre qui apparaît dans la section comparaison.",
      type: 'reference',
      to: [{type: 'offerPage'}],
      group: 'comparison',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'heroEyebrow',
    },
  },
})
