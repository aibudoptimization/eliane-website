import {defineType, defineField} from 'sanity'
import {linkMark} from './linkMark'

export default defineType({
  name: 'homePage',
  title: "Page d'accueil",
  type: 'document',
  groups: [
    {name: 'hero', title: 'Section Hero'},
    {name: 'marquees', title: 'Bande défilante (sous le hero)'},
    {name: 'sledComparison', title: 'Approche'},
    {name: 'meetTrainer', title: 'Rencontre ton entraîneure'},
    {name: 'pullQuote', title: 'Citation entre sections'},
    {name: 'offering', title: 'Mon accompagnement'},
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
      initialValue: 'Éliane Larre - Entraîneure personnelle à Montréal',
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
      name: 'marqueeItems',
      title: 'Phrases de la bande défilante',
      description:
        'Liste des phrases affichées en continu sous le hero (séparées par un point doré). Minimum 2 phrases.',
      type: 'array',
      group: 'marquees',
      of: [{type: 'string'}],
      initialValue: [
        'Entraînements en présentiel',
        'À Montréal',
        '10+ années de pratique',
        'Approche personnalisée',
        'Approche durable',
        'Progression mesurable',
      ],
      validation: (Rule) => Rule.min(2),
    }),
    defineField({
      name: 'marqueeOneItems',
      title: 'Bande 1 — phrases (ancien)',
      description: 'Champ remplacé par « Phrases de la bande défilante ». Conservé pour la migration.',
      type: 'array',
      group: 'marquees',
      of: [{type: 'string'}],
      hidden: true,
    }),
    defineField({
      name: 'marqueeTwoItems',
      title: 'Bande 2 — phrases (ancien)',
      description: 'Champ remplacé par « Phrases de la bande défilante ». Conservé pour la migration.',
      type: 'array',
      group: 'marquees',
      of: [{type: 'string'}],
      hidden: true,
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
      title: 'Photo (ancien)',
      description: 'Champ retiré — ne plus utiliser.',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', type: 'string', title: 'Texte alternatif'}],
      group: 'sledComparison',
      hidden: true,
    }),
    defineField({
      name: 'sledFromTitle',
      title: 'Titre — carte blanche',
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
      title: 'Titre — carte mauve',
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
      initialValue: 'Rencontre ton entraîneure',
    }),
    defineField({
      name: 'meetTrainerImage',
      title: 'Photo portrait',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', type: 'string', title: 'Texte alternatif'}],
      group: 'meetTrainer',
    }),
    defineField({
      name: 'meetTrainerCards',
      title: 'Cartes (défilement automatique)',
      description: 'Jusqu’à 4 cartes. Utilise **gras** dans le texte pour mettre des mots en évidence.',
      type: 'array',
      group: 'meetTrainer',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Libellé (ex. Mon parcours)',
              type: 'string',
            }),
            defineField({
              name: 'body',
              title: 'Texte de la carte',
              type: 'text',
              rows: 5,
            }),
          ],
          preview: {
            select: {title: 'label', subtitle: 'body'},
          },
        },
      ],
      validation: (Rule) => Rule.max(4),
    }),
    defineField({
      name: 'meetTrainerQuote',
      title: 'Citation (sous les cartes)',
      type: 'text',
      rows: 3,
      group: 'meetTrainer',
      initialValue:
        "Tu n'as pas besoin d'un autre programme. Tu as besoin d'un cadre, d'un regard expert et d'un accompagnement qui s'adapte réellement à toi.",
    }),
    defineField({
      name: 'meetTrainerBody',
      title: 'Texte (ancien)',
      description: 'Remplacé par les cartes. Conservé pour référence.',
      type: 'array',
      group: 'meetTrainer',
      hidden: true,
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
      title: 'Citation (ancien)',
      type: 'text',
      rows: 4,
      group: 'pullQuote',
      hidden: true,
    }),
    defineField({
      name: 'pullQuoteEnabled',
      title: 'Afficher la citation (ancien)',
      type: 'boolean',
      group: 'pullQuote',
      hidden: true,
    }),

    defineField({
      name: 'offeringEyebrow',
      title: 'Accroche',
      type: 'string',
      group: 'offering',
      initialValue: 'Mon accompagnement',
    }),
    defineField({
      name: 'offeringTitle',
      title: 'Titre principal',
      description: 'Le mot « personnalisé » sera affiché en italique mauve.',
      type: 'string',
      group: 'offering',
      initialValue: 'Un accompagnement personnalisé, du début à la fin.',
    }),
    defineField({
      name: 'offeringLead',
      title: 'Sous-titre (intro)',
      type: 'text',
      rows: 3,
      group: 'offering',
      initialValue:
        'Quatre piliers conçus ensemble pour te donner le cadre, la guidance et les outils dont tu as besoin pour progresser sans te perdre en route.',
    }),
    defineField({
      name: 'offeringHeadline',
      title: 'Titre de section (ancien)',
      type: 'string',
      group: 'offering',
      hidden: true,
    }),
    defineField({
      name: 'offeringImages',
      title: 'Captures d’écran (ancien)',
      type: 'array',
      group: 'offering',
      hidden: true,
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
      title: 'Piliers (4 items)',
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
      validation: (Rule) => Rule.min(1).max(4),
    }),
    defineField({
      name: 'offeringAppKicker',
      title: 'App — accroche',
      type: 'string',
      group: 'offering',
      initialValue: 'Application personnalisée',
    }),
    defineField({
      name: 'offeringAppTitle',
      title: 'App — titre',
      type: 'string',
      group: 'offering',
      initialValue: 'Un outil pensé pour toi, accessible où que tu sois.',
    }),
    defineField({
      name: 'offeringAppDescription',
      title: 'App — description',
      type: 'text',
      rows: 4,
      group: 'offering',
      initialValue:
        'Tes entraînements, ton historique de progression et tes communications avec moi, regroupés au même endroit. Simple, lisible, fait pour t\'accompagner sans t\'alourdir.',
    }),
    defineField({
      name: 'offeringAppImage',
      title: 'App — capture (téléphones)',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', type: 'string', title: 'Texte alternatif'}],
      group: 'offering',
    }),
    defineField({
      name: 'offeringCtaLabel',
      title: 'Libellé du bouton CTA',
      type: 'string',
      group: 'offering',
      initialValue: "Je veux voir si l'accompagnement est adapté pour moi",
    }),

    defineField({
      name: 'inPersonEyebrow',
      title: 'Accroche',
      type: 'string',
      group: 'inPerson',
      initialValue: 'Pourquoi le présentiel',
    }),
    defineField({
      name: 'inPersonTitle',
      title: 'Titre principal',
      description: '« le présentiel » sera affiché en italique mauve.',
      type: 'string',
      group: 'inPerson',
      initialValue: 'Pourquoi le présentiel change tout.',
    }),
    defineField({
      name: 'inPersonHeadline',
      title: 'Titre de section (ancien)',
      type: 'string',
      group: 'inPerson',
      hidden: true,
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
      name: 'presentielCards',
      title: 'Cartes (4 items)',
      type: 'array',
      group: 'inPerson',
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
            defineField({
              name: 'iconName',
              title: 'Icône',
              type: 'string',
              options: {
                list: [
                  {title: 'Coche (check)', value: 'check'},
                  {title: 'Bouclier (shield)', value: 'shield'},
                  {title: 'Horloge (clock)', value: 'clock'},
                  {title: 'Oeil (eye)', value: 'eye'},
                ],
                layout: 'dropdown',
              },
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {title: 'title', subtitle: 'iconName'},
          },
        },
      ],
      validation: (Rule) => Rule.min(1).max(4),
    }),
    defineField({
      name: 'inPersonBenefits',
      title: 'Cartes bénéfices (ancien)',
      description: 'Remplacé par « Cartes (4 items) ».',
      type: 'array',
      group: 'inPerson',
      hidden: true,
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
    }),
    defineField({
      name: 'locationQuote',
      title: 'Citation de clôture',
      description: 'Entoure un mot ou une expression avec *astérisques* pour l\'afficher en italique mauve.',
      type: 'text',
      rows: 3,
      group: 'inPerson',
      initialValue:
        "Un programme peut te dire *quoi faire*. Un accompagnement en présentiel te montre *comment le faire* et t'aide à progresser plus rapidement qu'en étant seule.",
    }),
    defineField({
      name: 'inPersonPunchLine',
      title: 'Phrase de clôture (ancien)',
      type: 'text',
      rows: 3,
      group: 'inPerson',
      hidden: true,
    }),

    defineField({
      name: 'reviewsEyebrow',
      title: 'Accroche',
      type: 'string',
      group: 'reviews',
      initialValue: 'Leur expérience',
    }),
    defineField({
      name: 'reviewsTitle',
      title: 'Titre principal',
      description: '« elles » sera affiché en italique mauve.',
      type: 'string',
      group: 'reviews',
      initialValue: "Ce qu'elles en disent.",
    }),
    defineField({
      name: 'reviewsHeadline',
      title: 'Titre de section (ancien)',
      type: 'string',
      group: 'reviews',
      hidden: true,
    }),
    defineField({
      name: 'testimonialVideos',
      title: 'Témoignages vidéo',
      type: 'array',
      group: 'reviews',
      of: [
        {
          type: 'object',
          name: 'testimonialVideo',
          fields: [
            defineField({
              name: 'reviewerName',
              title: 'Nom de la cliente',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'reviewerRole',
              title: 'Rôle (ex: Cliente)',
              type: 'string',
              initialValue: 'Cliente',
            }),
            defineField({
              name: 'video',
              title: 'Vidéo témoignage (MP4 vertical)',
              type: 'file',
              options: {accept: 'video/mp4'},
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'poster',
              title: 'Image de couverture (optionnel)',
              type: 'image',
              options: {hotspot: true},
            }),
          ],
          preview: {
            select: {title: 'reviewerName', subtitle: 'reviewerRole'},
          },
        },
      ],
    }),
    defineField({
      name: 'reviewsList',
      title: 'Témoignages texte (ancien)',
      type: 'array',
      group: 'reviews',
      hidden: true,
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
    }),

    defineField({
      name: 'forYouEyebrow',
      title: 'Accroche',
      type: 'string',
      group: 'forYouOrNot',
      initialValue: 'Pour toi ou pas ?',
    }),
    defineField({
      name: 'forYouTitle',
      title: 'Titre principal',
      type: 'string',
      group: 'forYouOrNot',
      initialValue: 'Une approche claire, pour les bonnes raisons.',
    }),
    defineField({
      name: 'forYouHeadline',
      title: 'Titre de section (ancien)',
      type: 'string',
      group: 'forYouOrNot',
      hidden: true,
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
      initialValue: "C'est pour toi si",
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
      initialValue: "Ce n'est probablement pas pour toi si",
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
      name: 'afterCallEyebrow',
      title: 'Accroche',
      type: 'string',
      group: 'afterCall',
      initialValue: 'Comment ça se passe',
    }),
    defineField({
      name: 'afterCallHeadline',
      title: 'Titre de section',
      type: 'string',
      group: 'afterCall',
      initialValue: "Après l'appel découverte.",
    }),
    defineField({
      name: 'afterCallIntro',
      title: 'Introduction',
      type: 'text',
      rows: 3,
      group: 'afterCall',
      initialValue:
        "L'appel est gratuit, sans engagement, et sert d'abord à voir si l'accompagnement est réellement pertinent pour toi.",
    }),
    defineField({
      name: 'afterCallSteps',
      title: 'Étapes (5 items)',
      type: 'array',
      group: 'afterCall',
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
      validation: (Rule) => Rule.min(5).max(5),
    }),
    defineField({
      name: 'afterCallItems',
      title: 'Liste à puces (ancien)',
      type: 'array',
      group: 'afterCall',
      hidden: true,
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'afterCallFooter',
      title: 'Texte de clôture (ancien)',
      type: 'text',
      rows: 3,
      group: 'afterCall',
      hidden: true,
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
