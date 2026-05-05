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
          collaborator: defineLocations({
            message: 'Collaborateurs',
            tone: 'positive',
            locations: [{ title: "Section Collaborateurs sur la Page d'accueil", href: '/#collaborateurs' }],
          }),
        },
      },
    }),
  ],
})
