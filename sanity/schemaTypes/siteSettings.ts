import {defineType, defineField} from 'sanity'
import {
  BRAND_ITALIC_COLOR_SWATCHES,
  DEFAULT_ACCENT_ITALIC_COLOR,
  DEFAULT_QUOTE_ITALIC_COLOR,
} from '../../lib/site-colors'

const italicColorOptions = {
  disableAlpha: true,
  colorList: BRAND_ITALIC_COLOR_SWATCHES,
}

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
    defineField({
      name: 'metaTitle',
      title: 'Titre SEO (balise title)',
      description:
        "Laisse vide pour utiliser le titre par défaut. Recommandé : moins de 60 caractères.",
      type: 'string',
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Description SEO (meta description)',
      description:
        "Laisse vide pour utiliser la description par défaut. Recommandé : 120–160 caractères.",
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'accentItalicColor',
      title: 'Couleur italique accent (titres et texte)',
      description: `Couleur des mots en italique (mauve) hors citations. Mauve par défaut : ${DEFAULT_ACCENT_ITALIC_COLOR}`,
      type: 'color',
      options: italicColorOptions,
    }),
    defineField({
      name: 'quoteItalicColor',
      title: 'Couleur italique des citations',
      description: `Couleur de l'italique dans les encadrés mauve. Noir par défaut : ${DEFAULT_QUOTE_ITALIC_COLOR}`,
      type: 'color',
      options: italicColorOptions,
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon (icône du site)',
      description:
        'Image carrée affichée dans l’onglet du navigateur. Format recommandé : PNG 512×512 px. Laisse vide pour utiliser le logo par défaut.',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'ogImage',
      title: 'Image de partage (Open Graph)',
      description:
        "Image affichée lors du partage du site sur les réseaux sociaux. Format recommandé : 1200×630 px. Laisse vide pour utiliser l'image par défaut.",
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  preview: {
    prepare: () => ({title: 'Paramètres du site'}),
  },
})
