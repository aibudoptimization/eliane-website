import { defineConfig } from 'sanity'
import { presentationTool, defineLocations } from 'sanity/presentation'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemaTypes'
import { apiVersion, dataset, projectId } from './sanity/env'
import { structure } from './sanity/structure'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  title: 'Éliane Larre — Studio',
  schema: { types: schemaTypes },
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
    presentationTool({
      previewUrl: {
        origin:
          typeof location === 'undefined'
            ? 'http://localhost:3000'
            : location.origin,
        previewMode: {
          enable: '/api/draft-mode/enable',
          disable: '/api/draft-mode/disable',
        },
      },
      resolve: {
        locations: {
          homePage: defineLocations({
            message: "Page d'accueil",
            tone: 'positive',
            locations: [{ title: "Page d'accueil", href: '/' }],
          }),
          homepageOffers: defineLocations({
            message: 'Offres du site',
            tone: 'positive',
            locations: [
              { title: "Carte Le Tremplin (Page d'accueil)", href: '/#offres' },
              { title: "Carte Offre signature (Page d'accueil)", href: '/#offres' },
            ],
          }),
          siteSettings: defineLocations({
            message: 'Paramètres du site',
            tone: 'positive',
            locations: [{ title: "Page d'accueil", href: '/' }],
          }),
          faq: defineLocations({
            message: 'Questions fréquentes',
            tone: 'positive',
            locations: [{ title: "Section FAQ sur la Page d'accueil", href: '/#faq' }],
          }),
        },
      },
    }),
  ],
})
