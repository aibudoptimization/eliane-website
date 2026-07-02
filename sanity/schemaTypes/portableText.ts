import {defineField} from 'sanity'
import {linkMark} from './linkMark'

type RichTextFieldOptions = {
  group?: string
  description?: string
  withLinks?: boolean
  required?: boolean
}

export const strongDecorator = {title: 'Gras', value: 'strong'}
export const emDecorator = {title: 'Italique (mauve)', value: 'em'}
export const plainEmDecorator = {title: 'Italique', value: 'em'}
export const richTextDecorators = [strongDecorator, emDecorator]
export const quoteDecorators = [strongDecorator, plainEmDecorator]

/** Titles, subtitles, and body copy — italic color: Paramètres du site → Couleur italique accent. */
export const RICH_TEXT_FIELD_DESCRIPTION =
  'Gras ou Italique (mauve) sur les mots à mettre en évidence. La couleur du mauve se règle dans Paramètres du site.'

/** Quote boxes — italic color: Paramètres du site → Couleur italique des citations. */
export const QUOTE_FIELD_DESCRIPTION =
  'Gras ou italique sur les mots à mettre en évidence. La couleur de l’italique se règle dans Paramètres du site.'

/** Inline rich text (titles, single-line headings). */
export const inlineRichBlock = {
  type: 'block' as const,
  styles: [{title: 'Normal', value: 'normal'}],
  lists: [],
  marks: {
    decorators: richTextDecorators,
    annotations: [],
  },
}

/** Body rich text (paragraphs, optional lists + links). */
export function bodyRichBlock(withLinks = false) {
  return {
    type: 'block' as const,
    styles: [{title: 'Normal', value: 'normal'}],
    lists: withLinks
      ? [
          {title: 'Liste à puces', value: 'bullet'},
          {title: 'Liste numérotée', value: 'number'},
        ]
      : [],
    marks: {
      decorators: richTextDecorators,
      annotations: withLinks ? [linkMark] : [],
    },
  }
}

/** Quote rich text — Studio: Gras / Italique only (no plum on site). */
export const quoteRichBlock = {
  type: 'block' as const,
  styles: [{title: 'Normal', value: 'normal'}],
  lists: [],
  marks: {
    decorators: quoteDecorators,
    annotations: [],
  },
}

export function richTextField(
  name: string,
  title: string,
  options: RichTextFieldOptions = {},
): ReturnType<typeof defineField> {
  const {group, description, withLinks = false, required} = options
  return defineField({
    name,
    title,
    type: 'array',
    group,
    description: description ?? RICH_TEXT_FIELD_DESCRIPTION,
    of: [bodyRichBlock(withLinks)],
    validation: required ? (Rule) => Rule.required().min(1) : undefined,
  })
}

/** Single-block inline field (section titles). */
export function inlineRichTextField(
  name: string,
  title: string,
  options: Omit<RichTextFieldOptions, 'withLinks'> = {},
): ReturnType<typeof defineField> {
  const {group, description, required} = options
  return defineField({
    name,
    title,
    type: 'array',
    group,
    description: description ?? RICH_TEXT_FIELD_DESCRIPTION,
    of: [inlineRichBlock],
    validation: required
      ? (Rule) => Rule.required().max(1)
      : (Rule) => Rule.max(1),
  })
}

export function quoteRichTextField(
  name: string,
  title: string,
  options: Omit<RichTextFieldOptions, 'withLinks' | 'required'> = {},
): ReturnType<typeof defineField> {
  const {group, description} = options
  return defineField({
    name,
    title,
    type: 'array',
    group,
    description: description ?? QUOTE_FIELD_DESCRIPTION,
    of: [quoteRichBlock],
  })
}
