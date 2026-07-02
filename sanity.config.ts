import {colorInput} from '@sanity/color-input'
import {defineConfig} from 'sanity'
import {presentationTool, defineLocations} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './sanity/schemaTypes'
import {apiVersion, dataset, projectId} from './sanity/env'
import {structure} from './sanity/structure'
import {elianeStudioTheme} from './sanity/theme'
import {HomePageDocumentInput} from './sanity/components/HomePageInput'
import {PresentationNavigator} from './sanity/components/PresentationNavigator'
import {StudioIcon} from './sanity/components/StudioIcon'
import {StudioLayout} from './sanity/components/StudioLayout'
import {StudioNavbar} from './sanity/components/StudioNavbar'
import {mainDocuments} from './sanity/presentationResolve'
import type {InputProps} from 'sanity'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  title: 'Éliane Larre — Studio',
  icon: StudioIcon,
  theme: elianeStudioTheme,
  schema: {types: schemaTypes},
  form: {
    components: {
      input: (props) => {
        if (
          props.id === 'root' &&
          props.schemaType?.name === 'homePage' &&
          props.schemaType?.type?.name === 'document'
        ) {
          return HomePageDocumentInput(props as InputProps)
        }
        return props.renderDefault(props)
      },
    },
  },
  studio: {
    components: {
      layout: StudioLayout,
      navbar: StudioNavbar,
    },
  },
  tools: (prev) => {
    const tools = prev.filter((tool) => tool.name !== 'vision')
    return [...tools].sort((a, b) => {
      if (a.name === 'presentation') return -1
      if (b.name === 'presentation') return 1
      if (a.name === 'structure') return -1
      if (b.name === 'structure') return 1
      return 0
    })
  },
  plugins: [
    structureTool({
      structure,
      title: 'Contenu',
    }),
    colorInput(),
    presentationTool({
      title: 'Aperçu du site',
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
      components: {
        unstable_navigator: {
          minWidth: 240,
          maxWidth: 320,
          component: PresentationNavigator,
        },
      },
      resolve: {
        mainDocuments,
        locations: {
          homePage: defineLocations({
            message: "Page d'accueil",
            tone: 'positive',
            locations: [{title: "Page d'accueil", href: '/'}],
          }),
          siteSettings: defineLocations({
            message: 'Paramètres du site',
            tone: 'positive',
            locations: [{title: "Page d'accueil", href: '/'}],
          }),
          faq: defineLocations({
            message: 'Questions fréquentes',
            tone: 'positive',
            locations: [{title: "Section FAQ sur la Page d'accueil", href: '/#faq'}],
          }),
          collaborator: defineLocations({
            message: 'Collaborateurs',
            tone: 'positive',
            locations: [
              {title: "Section Collaborateurs sur la Page d'accueil", href: '/#collaborateurs'},
            ],
          }),
        },
      },
    }),
  ],
})
