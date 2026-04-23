import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenu')
    .items([
      S.documentTypeListItem('siteSettings').title('Paramètres du site'),
      S.divider(),
      S.listItem()
        .title("Page d'accueil")
        .child(
          S.list()
            .title("Page d'accueil")
            .items([
              S.documentTypeListItem('homePage').title('Sections'),
              S.documentTypeListItem('homepageOffers').title('Offres du site'),
              S.documentTypeListItem('faq').title('Questions fréquentes'),
            ]),
        ),
    ])
