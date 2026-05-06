import {defineType, defineField} from 'sanity'
import {linkMark} from './linkMark'

export default defineType({
  name: 'homePage',
  title: "Page d'accueil",
  type: 'document',
  groups: [
    {name: 'hero', title: 'Section Hero'},
    {name: 'marquees', title: 'Bandes défilantes (haut)'},
    {name: 'sledComparison', title: 'Tu veux progresser…'},
    {name: 'meetTrainer', title: 'Rencontre ton entraîneure'},
    {name: 'pullQuote', title: 'Citation entre sections'},
    {name: 'offering', title: 'Mon accompagnement personnalisé'},
    {name: 'inPerson', title: 'Pourquoi le présentiel'},
    {name: 'reviews', title: 'Leur expérience'},
    {name: 'forYouOrNot', title: 'Pour toi ou pas?'},
    {name: 'afterCall', title: "Comment ça se passe après l'appel"},
    {name: 'purpleCta', title: 'Bande mauve CTA'},
    {name: 'faqIntro', title: 'Intro FAQ'},
    {name: 'collaborators', title: 'Collaborateurs'},
  ],
  fields: [
    defineField({
      name: 'heroKicker',
      title: 'Accroche (ligne au-dessus du titre)',
      description: 'Ne pas inclure de point au début.',
      type: 'string',
      group: 'hero',
      initialValue: 'ENTRAÎNEURE PERSONNELLE • MONTRÉAL',
    }),
    defineField({
      name: 'heroHeadline',
      title: 'Titre principal',
      description: 'Italique et gras uniquement. Pas de listes ni de liens.',
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroSubheadline',
      title: 'Sous-titre',
      type: 'text',
      rows: 4,
      group: 'hero',
    }),
    defineField({
      name: 'heroImage',
      title: 'Photo principale',
      description: 'Photo affichée sur le côté gauche du hero.',
      type: 'image',
      options: {hotspot: true},
      fields: [
        {name: 'alt', type: 'string', title: 'Texte alternatif (accessibilité)'},
      ],
      group: 'hero',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroCtaLabel',
      title: 'Libellé du bouton CTA',
      type: 'string',
      group: 'hero',
      initialValue: 'Je veux discuter de mes objectifs',
    }),
    defineField({
      name: 'heroCtaSubtext',
      title: 'Texte sous le CTA',
      type: 'string',
      group: 'hero',
      initialValue:
        "Appel gratuit, sans engagement pour voir si l'accompagnement est adapté à toi.",
    }),

    defineField({
      name: 'marqueeOneItems',
      title: 'Bande 1 — phrases',
      description:
        "Phrases défilantes en petit texte majuscule, animées en continu. Affichées sur toutes les tailles d'écran.",
      type: 'array',
      group: 'marquees',
      of: [{type: 'string'}],
      initialValue: [
        'Entraînements en présentiel',
        'À Montréal',
        '10+ années de pratique',
        'Approche personnalisée',
      ],
      validation: (Rule) => Rule.min(2),
    }),
    defineField({
      name: 'marqueeTwoItems',
      title: 'Bande 2 — phrases',
      description:
        'Phrases en plus gros texte. Affichées en grille statique sur desktop (≥768px), en bande défilante sur mobile.',
      type: 'array',
      group: 'marquees',
      of: [{type: 'string'}],
      initialValue: [
        'Approche durable',
        'Accompagnement personnalisé',
        'Progression mesurable',
      ],
      validation: (Rule) => Rule.min(3).max(3),
    }),

    defineField({
      name: 'sledHeadline',
      title: 'Titre',
      type: 'array',
      group: 'sledComparison',
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
      name: 'sledSubheadline',
      title: 'Sous-titre',
      type: 'text',
      rows: 3,
      group: 'sledComparison',
    }),
    defineField({
      name: 'sledImage',
      title: 'Photo (traîneau / effort)',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', type: 'string', title: 'Texte alternatif'}],
      group: 'sledComparison',
    }),
    defineField({
      name: 'sledFromTitle',
      title: 'Titre — colonne de départ',
      type: 'string',
      group: 'sledComparison',
      initialValue: "Là où tu es aujourd'hui",
    }),
    defineField({
      name: 'sledFromItems',
      title: 'Liste — départ',
      type: 'array',
      group: 'sledComparison',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'text',
              title: 'Texte',
              type: 'array',
              of: [
                {
                  type: 'block',
                  styles: [{title: 'Normal', value: 'normal'}],
                  lists: [],
                  marks: {
                    decorators: [{title: 'Gras', value: 'strong'}],
                    annotations: [],
                  },
                },
              ],
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.min(1).max(8),
    }),
    defineField({
      name: 'sledToTitle',
      title: 'Titre — colonne d’arrivée',
      type: 'string',
      group: 'sledComparison',
      initialValue: "Là où je vais t'amener",
    }),
    defineField({
      name: 'sledToItems',
      title: 'Liste — arrivée',
      type: 'array',
      group: 'sledComparison',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'text',
              title: 'Texte',
              type: 'array',
              of: [
                {
                  type: 'block',
                  styles: [{title: 'Normal', value: 'normal'}],
                  lists: [],
                  marks: {
                    decorators: [{title: 'Gras', value: 'strong'}],
                    annotations: [],
                  },
                },
              ],
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.min(1).max(8),
    }),
    defineField({
      name: 'sledCtaLabel',
      title: 'Libellé du bouton CTA',
      type: 'string',
      group: 'sledComparison',
      initialValue: "C'est là que je veux aller",
    }),

    defineField({
      name: 'meetTrainerKicker',
      title: 'Accroche',
      type: 'string',
      group: 'meetTrainer',
      initialValue: 'RENCONTRE TON ENTRAÎNEURE',
    }),
    defineField({
      name: 'meetTrainerImage',
      title: 'Photo',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', type: 'string', title: 'Texte alternatif'}],
      group: 'meetTrainer',
    }),
    defineField({
      name: 'meetTrainerBody',
      title: 'Texte',
      description:
        'Mets en gras les phrases que tu veux faire ressortir — elles seront affichées en plus gros.',
      type: 'array',
      group: 'meetTrainer',
      of: [
        {
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [],
          marks: {
            decorators: [
              {title: 'Gras', value: 'strong'},
              {title: 'Italique', value: 'em'},
            ],
            annotations: [linkMark],
          },
        },
      ],
    }),
    defineField({
      name: 'meetTrainerCtaLabel',
      title: 'Libellé du lien (ex. Instagram)',
      type: 'string',
      group: 'meetTrainer',
      initialValue: 'Voir mon quotidien sur Instagram',
    }),
    defineField({
      name: 'meetTrainerCtaUrl',
      title: 'URL du lien',
      type: 'url',
      group: 'meetTrainer',
    }),

    defineField({
      name: 'pullQuoteText',
      title: 'Citation',
      type: 'text',
      rows: 4,
      group: 'pullQuote',
      initialValue:
        "Tu n'as pas besoin d'un autre programme. Tu as besoin d'un cadre, d'un regard expert et d'un accompagnement qui s'adapte réellement à toi.",
    }),
    defineField({
      name: 'pullQuoteEnabled',
      title: 'Afficher la citation',
      description: 'Décocher pour masquer la citation.',
      type: 'boolean',
      group: 'pullQuote',
      initialValue: true,
    }),

    defineField({
      name: 'offeringHeadline',
      title: 'Titre de section',
      type: 'string',
      group: 'offering',
      initialValue: 'Mon accompagnement personnalisé',
    }),
    defineField({
      name: 'offeringImages',
      title: 'Captures d’écran',
      description: "3 captures d'écran de l'application.",
      type: 'array',
      group: 'offering',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [{name: 'alt', type: 'string', title: 'Texte alternatif'}],
        },
      ],
    }),
    defineField({
      name: 'offeringFeatures',
      title: 'Atouts',
      type: 'array',
      group: 'offering',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Titre',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'offeringCtaLabel',
      title: 'Libellé du bouton CTA',
      type: 'string',
      group: 'offering',
      initialValue: "Je veux voir si l'accompagnement est adapté pour moi",
    }),

    defineField({
      name: 'inPersonHeadline',
      title: 'Titre de section',
      type: 'string',
      group: 'inPerson',
      initialValue: 'Pourquoi le présentiel',
    }),
    defineField({
      name: 'inPersonIntro',
      title: 'Introduction',
      type: 'text',
      rows: 3,
      group: 'inPerson',
      initialValue:
        "Parce que la façon dont on s'entraîne change tout. Voici ce que le présentiel t'offre que rien d'autre ne peut remplacer.",
    }),
    defineField({
      name: 'inPersonBenefits',
      title: 'Cartes bénéfices',
      description: 'Cartes affichées dans la section présentiel (icône, titre, texte).',
      type: 'array',
      group: 'inPerson',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icône',
              type: 'string',
              options: {
                list: [
                  {title: 'Oeil (eye)', value: 'eye'},
                  {title: 'Bouclier (shield-check)', value: 'shield-check'},
                  {title: 'Calendrier (calendar-check)', value: 'calendar-check'},
                  {title: 'Activite (activity)', value: 'activity'},
                ],
                layout: 'dropdown',
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'title',
              title: 'Titre',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'text',
              title: 'Texte',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'icon',
            },
          },
        },
      ],
      initialValue: [
        {
          _type: 'object',
          icon: 'eye',
          title: 'Correction en temps réel',
          text: "J'ajuste ta technique pour maximiser ta progression et diminuer les risques de blessure.",
        },
        {
          _type: 'object',
          icon: 'shield-check',
          title: 'Progression sécuritaire',
          text: "Je t'aide à progresser tout en respectant ton rythme.",
        },
        {
          _type: 'object',
          icon: 'calendar-check',
          title: 'Imputabilité',
          text: "Le présentiel ajoute une structure qui soutient l'engagement.",
        },
        {
          _type: 'object',
          icon: 'activity',
          title: 'Adaptation à ton état',
          text: 'Un entraînement sur mesure, pour toi, selon ton énergie, tes besoins et tes envies.',
        },
      ],
      validation: (Rule) => Rule.min(1).max(6),
    }),
    defineField({
      name: 'inPersonPunchLine',
      title: 'Phrase de clôture (sous le bloc présentiel)',
      type: 'text',
      rows: 3,
      group: 'inPerson',
      initialValue:
        "Un programme peut te dire quoi faire.\nUn accompagnement en présentiel te montre comment le faire et t'aide à progresser plus rapidement qu'en étant seule.",
    }),

    defineField({
      name: 'reviewsHeadline',
      title: 'Titre de section',
      type: 'string',
      group: 'reviews',
      initialValue: 'Leur expérience',
    }),
    defineField({
      name: 'reviewsList',
      title: 'Témoignages',
      description: 'Témoignages affichés en cartes statiques. Min 1, max 6.',
      type: 'array',
      group: 'reviews',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Nom',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'rating',
              title: 'Note (étoiles)',
              type: 'number',
              initialValue: 5,
              validation: (Rule) => Rule.min(1).max(5).integer(),
            }),
            defineField({
              name: 'excerpt',
              title: 'Extrait',
              type: 'text',
              rows: 4,
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.min(1).max(6),
    }),

    defineField({
      name: 'forYouHeadline',
      title: 'Titre de section',
      type: 'string',
      group: 'forYouOrNot',
      initialValue: 'Pour toi ou pas?',
    }),
    defineField({
      name: 'forYouImage',
      title: 'Photo',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', type: 'string', title: 'Texte alternatif'}],
      group: 'forYouOrNot',
    }),
    defineField({
      name: 'forYouYesTitle',
      title: 'Titre — oui',
      type: 'string',
      group: 'forYouOrNot',
      initialValue: "C'est pour toi si :",
    }),
    defineField({
      name: 'forYouYesItems',
      title: 'Liste — oui',
      type: 'array',
      group: 'forYouOrNot',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'forYouNoTitle',
      title: 'Titre — non',
      type: 'string',
      group: 'forYouOrNot',
      initialValue: "Ce n'est probablement pas pour toi si :",
    }),
    defineField({
      name: 'forYouNoItems',
      title: 'Liste — non',
      type: 'array',
      group: 'forYouOrNot',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'forYouFooter',
      title: 'Texte de pied de section',
      type: 'text',
      rows: 3,
      group: 'forYouOrNot',
      initialValue:
        'Cet accompagnement s\'adresse aux femmes qui veulent investir sérieusement dans leur progression, leur confiance et leur santé à long terme.',
    }),
    defineField({
      name: 'forYouCtaLabel',
      title: 'Libellé du bouton CTA',
      type: 'string',
      group: 'forYouOrNot',
      initialValue: "Je veux savoir si c'est pour moi",
    }),

    defineField({
      name: 'afterCallHeadline',
      title: 'Titre de section',
      type: 'string',
      group: 'afterCall',
      initialValue: "Comment ça se passe après l'appel?",
    }),
    defineField({
      name: 'afterCallIntro',
      title: 'Introduction',
      type: 'string',
      group: 'afterCall',
      initialValue: "L'appel découverte sert à :",
    }),
    defineField({
      name: 'afterCallItems',
      title: 'Liste à puces',
      type: 'array',
      group: 'afterCall',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'afterCallFooter',
      title: 'Texte de clôture',
      type: 'text',
      rows: 3,
      group: 'afterCall',
      initialValue:
        "L'appel est gratuit, sans engagement, et sert d'abord à voir si l'accompagnement est réellement pertinent pour toi.",
    }),
    defineField({
      name: 'afterCallCtaLabel',
      title: 'Libellé du bouton CTA',
      type: 'string',
      group: 'afterCall',
      initialValue: "Je suis prête à avoir plus d'informations",
    }),

    defineField({
      name: 'purpleCtaHeadline',
      title: 'Titre',
      type: 'string',
      group: 'purpleCta',
      initialValue: 'Es-tu prête à investir en toi ?',
    }),
    defineField({
      name: 'purpleCtaButtonLabel',
      title: 'Libellé du bouton',
      type: 'string',
      group: 'purpleCta',
      initialValue: "Je veux passer à l'action",
    }),
    defineField({
      name: 'purpleCtaFooter',
      title: 'Texte sous le bouton',
      type: 'string',
      group: 'purpleCta',
      initialValue: 'Gratuit et sans engagement',
    }),

    defineField({
      name: 'faqHeadline',
      title: 'Titre affiché au-dessus de la FAQ',
      description: 'Le contenu des questions est géré dans le document FAQ.',
      type: 'string',
      group: 'faqIntro',
      initialValue: 'Questions fréquentes',
    }),

    defineField({
      name: 'collaboratorsHeadline',
      title: 'Titre de section',
      type: 'string',
      group: 'collaborators',
      initialValue: 'Mes collaborateurs',
    }),
    defineField({
      name: 'collaboratorsIntro',
      title: 'Introduction',
      type: 'text',
      rows: 2,
      group: 'collaborators',
    }),
  ],
  preview: {
    prepare: () => ({title: "Page d'accueil"}),
  },
})
