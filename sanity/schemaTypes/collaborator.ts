import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'collaborator',
  title: 'Collaborateur',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      description: 'Optionnel — affiché à côté du nom si présent.',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', type: 'string', title: 'Texte alternatif'}],
    }),
    defineField({
      name: 'website',
      title: 'Site web',
      type: 'url',
    }),
    defineField({
      name: 'featured',
      title: 'Mis en avant',
      description:
        "Cocher pour afficher ce collaborateur dans la section principale de la page d'accueil. Sinon, il apparaît dans la liste secondaire.",
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: "Ordre d'affichage",
      description: 'Plus petit = affiché en premier.',
      type: 'number',
    }),
  ],
  preview: {
    select: {title: 'name', featured: 'featured'},
    prepare({title, featured}: {title?: string; featured?: boolean}) {
      return {
        title: title ?? 'Sans nom',
        subtitle: featured ? 'Mis en avant' : undefined,
      }
    },
  },
})
