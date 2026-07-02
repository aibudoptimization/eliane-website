import type {SanityClient} from 'sanity'
import type {StructureBuilder, StructureResolver} from 'sanity/structure'
import {apiVersion} from './env'
import {HOME_PAGE_ID, SITE_SETTINGS_ID} from './ids'
import {HOME_PAGE_SECTIONS} from './homePageSections'
import {resolveSingletonDocumentId} from './resolveSingletonId'

const GROUPED_HOME_PAGE_SECTIONS = new Set(['collaborateurs', 'faq'])

const HOME_PAGE_SECTION_SHORTCUTS = HOME_PAGE_SECTIONS.filter(
  (section) => !GROUPED_HOME_PAGE_SECTIONS.has(section.sectionId),
)

function homePageSectionDocument(
  S: StructureBuilder,
  documentId: string,
  title: string,
  sectionId: string,
) {
  return S.document()
    .id(`homePage-${sectionId}`)
    .schemaType('homePage')
    .documentId(documentId)
    .title(title)
    .views([S.view.form().id(`form-${sectionId}`)])
}

function homePageSectionListItem(
  S: StructureBuilder,
  client: SanityClient,
  title: string,
  sectionId: string,
) {
  return S.listItem()
    .id(`section-${sectionId}`)
    .title(title)
    .child(async () => {
      const documentId = await resolveSingletonDocumentId(client, 'homePage', HOME_PAGE_ID)
      return homePageSectionDocument(
        S,
        documentId,
        sectionId === 'all'
          ? "Page d'accueil — toutes les sections"
          : `Page d'accueil — ${title}`,
        sectionId,
      )
    })
}

function collaborateursHub(S: StructureBuilder, client: SanityClient) {
  return S.listItem()
    .id('section-collaborateurs-group')
    .title('Collaborateurs')
    .child(
      S.list()
        .id('collaborateurs-hub')
        .title('Collaborateurs')
        .items([
          homePageSectionListItem(
            S,
            client,
            'Titre et introduction',
            'collaborateurs',
          ),
          S.divider(),
          S.documentTypeListItem('collaborator').title('Liste des collaborateurs'),
        ]),
    )
}

function faqHub(S: StructureBuilder, client: SanityClient) {
  return S.listItem()
    .id('section-faq-group')
    .title('Questions fréquentes')
    .child(
      S.list()
        .id('faq-hub')
        .title('Questions fréquentes')
        .items([
          homePageSectionListItem(S, client, 'Titre et introduction', 'faq'),
          S.divider(),
          S.documentTypeListItem('faq').title('Liste des questions'),
        ]),
    )
}

export const structure: StructureResolver = (S, context) => {
  const client = context.getClient({apiVersion})

  return S.list()
    .title("Page d'accueil")
    .items([
      S.listItem()
        .title('Paramètres du site')
        .child(async () => {
          const documentId = await resolveSingletonDocumentId(
            client,
            'siteSettings',
            SITE_SETTINGS_ID,
          )
          return S.document()
            .schemaType('siteSettings')
            .documentId(documentId)
            .title('Paramètres du site')
        }),
      S.divider(),
      ...HOME_PAGE_SECTION_SHORTCUTS.map(({title, sectionId}) =>
        homePageSectionListItem(S, client, title, sectionId),
      ),
      collaborateursHub(S, client),
      faqHub(S, client),
    ])
}
