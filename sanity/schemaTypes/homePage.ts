import {defineType, defineField} from 'sanity'
import {
  bodyRichBlock,
  inlineRichTextField,
  quoteRichTextField,
  richTextField,
  RICH_TEXT_FIELD_DESCRIPTION,
} from './portableText'

export default defineType({
  name: 'homePage',
  title: "Page d'accueil",
  type: 'document',
  preview: {
    select: {kicker: 'heroKicker'},
    prepare: ({kicker}: {kicker?: string}) => ({title: kicker || "Page d'accueil"}),
  },
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
      title: 'Accroche',
      description: 'Ligne au-dessus du titre principal. Ne pas inclure de point au début.',
      type: 'string',
      group: 'hero',
      initialValue: 'Éliane Larre - Entraîneure personnelle à Montréal',
    }),
    inlineRichTextField('heroHeadline', 'Titre principal', {
      group: 'hero',
      required: true,
    }),
    richTextField('heroSubheadline', 'Sous-titre', {
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
      name: 'sledEyebrow',
      title: 'Accroche',
      type: 'string',
      group: 'sledComparison',
      initialValue: 'Approche',
    }),
    inlineRichTextField('sledHeadline', 'Titre', {
      group: 'sledComparison',
    }),
    richTextField('sledSubheadline', 'Sous-titre', {
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
      description: 'Jusqu’à 4 cartes. Utilise Gras ou Italique (mauve) dans le texte de chaque carte.',
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
              type: 'array',
              of: [bodyRichBlock(false)],
              description: RICH_TEXT_FIELD_DESCRIPTION,
            }),
          ],
          preview: {
            select: {title: 'label', subtitle: 'body'},
          },
        },
      ],
      validation: (Rule) => Rule.max(4),
    }),
    quoteRichTextField('meetTrainerQuote', 'Citation (sous les cartes)', {
      group: 'meetTrainer',
    }),
    defineField({
      name: 'meetTrainerBody',
      title: 'Texte (ancien)',
      description: 'Remplacé par les cartes. Conservé pour référence.',
      type: 'array',
      group: 'meetTrainer',
      hidden: true,
      of: [bodyRichBlock(true)],
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
    inlineRichTextField('offeringTitle', 'Titre principal', {
      group: 'offering',
    }),
    richTextField('offeringLead', 'Sous-titre (intro)', {
      group: 'offering',
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
              type: 'array',
              of: [bodyRichBlock(false)],
              description: RICH_TEXT_FIELD_DESCRIPTION,
              validation: (Rule) => Rule.required().min(1),
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
    richTextField('offeringAppDescription', 'App — description', {
      group: 'offering',
    }),
    defineField({
      name: 'offeringAppScreens',
      title: "App — captures d'écran",
      description:
        "Une image par téléphone, avec sa légende. Ajoute autant d'écrans que tu veux (le carrousel s'adapte). Chaque capture doit montrer un seul téléphone sur fond transparent.",
      type: 'array',
      group: 'offering',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'image',
              title: 'Capture',
              type: 'image',
              options: {hotspot: true},
              fields: [{name: 'alt', type: 'string', title: 'Texte alternatif'}],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'caption',
              title: 'Légende',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {title: 'caption', media: 'image'},
          },
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'offeringAppImage',
      title: 'App — capture (ancien montage)',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', type: 'string', title: 'Texte alternatif'}],
      group: 'offering',
      hidden: true,
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
    inlineRichTextField('inPersonTitle', 'Titre principal', {
      group: 'inPerson',
    }),
    defineField({
      name: 'inPersonHeadline',
      title: 'Titre de section (ancien)',
      type: 'string',
      group: 'inPerson',
      hidden: true,
    }),
    richTextField('inPersonIntro', 'Introduction', {
      group: 'inPerson',
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
              type: 'array',
              of: [bodyRichBlock(false)],
              description: RICH_TEXT_FIELD_DESCRIPTION,
              validation: (Rule) => Rule.required().min(1),
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
    quoteRichTextField('locationQuote', 'Citation de clôture', {
      group: 'inPerson',
    }),
    defineField({
      name: 'inPersonLocEyebrow',
      title: 'Lieu — accroche',
      type: 'string',
      group: 'inPerson',
      initialValue: 'Où ça se passe',
    }),
    defineField({
      name: 'inPersonLocVenue',
      title: 'Lieu — nom de la salle',
      type: 'string',
      group: 'inPerson',
      initialValue: 'Biner Training',
    }),
    defineField({
      name: 'inPersonLocStreet',
      title: 'Lieu — adresse (ligne 1)',
      type: 'string',
      group: 'inPerson',
      initialValue: '220 Boulevard Crémazie Ouest',
    }),
    defineField({
      name: 'inPersonLocCityLine',
      title: 'Lieu — ville et code postal (ligne 2)',
      type: 'string',
      group: 'inPerson',
      initialValue: 'Montréal, QC · H2P 1C6',
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
    inlineRichTextField('reviewsTitle', 'Titre principal', {
      group: 'reviews',
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
    inlineRichTextField('forYouTitle', 'Titre principal', {
      group: 'forYouOrNot',
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
    quoteRichTextField('forYouFooter', 'Citation', {
      group: 'forYouOrNot',
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
    inlineRichTextField('afterCallHeadline', 'Titre principal', {
      group: 'afterCall',
    }),
    richTextField('afterCallIntro', 'Sous-titre', {
      group: 'afterCall',
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
              type: 'array',
              of: [bodyRichBlock(false)],
              description: RICH_TEXT_FIELD_DESCRIPTION,
              validation: (Rule) => Rule.required().min(1),
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
      name: 'purpleCtaEyebrow',
      title: 'Accroche',
      type: 'string',
      group: 'purpleCta',
      initialValue: 'Prochaine étape',
    }),
    inlineRichTextField('purpleCtaHeadline', 'Titre principal', {
      group: 'purpleCta',
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
      name: 'faqEyebrow',
      title: 'Accroche',
      type: 'string',
      group: 'faqIntro',
      initialValue: 'FAQ',
    }),
    inlineRichTextField('faqHeadline', 'Titre principal', {
      group: 'faqIntro',
    }),
    richTextField('faqSubheadline', 'Sous-titre', {
      group: 'faqIntro',
    }),

    defineField({
      name: 'collaboratorsHeadline',
      title: 'Accroche',
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
})
