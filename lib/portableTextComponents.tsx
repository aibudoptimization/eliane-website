import type {ReactNode} from 'react'
import {PortableText, type PortableTextComponents} from '@portabletext/react'
import type {TypedObject} from '@portabletext/types'
import {portableTextToPlainText} from '@/lib/portableTextPlainText'

export type PortableTextValue = TypedObject[]

export function isPortableTextValue(value: unknown): value is PortableTextValue {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    typeof value[0] === 'object' &&
    value[0] !== null &&
    '_type' in value[0]
  )
}

function linkMarkComponent({
  children,
  value,
}: {
  children?: ReactNode
  value?: {href?: string; openInNewTab?: boolean}
}) {
  const href = value?.href
  if (!href) return <>{children}</>
  const openInNewTab = value.openInNewTab !== false
  return (
    <a
      href={href}
      target={openInNewTab ? '_blank' : undefined}
      rel={openInNewTab ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  )
}

/** Italique → mauve (`.accent` on headings, `.text-accent` elsewhere). */
export function createPortableTextComponents(
  emClassName = 'text-accent',
): PortableTextComponents {
  return {
    marks: {
      strong: ({children}) => <strong>{children}</strong>,
      em: ({children}) => <em className={emClassName}>{children}</em>,
      link: linkMarkComponent,
    },
    block: {
      normal: ({children}) => <>{children}</>,
    },
    list: {
      bullet: ({children}) => <ul>{children}</ul>,
      number: ({children}) => <ol>{children}</ol>,
    },
    listItem: {
      bullet: ({children}) => <li>{children}</li>,
      number: ({children}) => <li>{children}</li>,
    },
  }
}

export const headingPortableTextComponents = createPortableTextComponents('accent')
export const bodyPortableTextComponents = createPortableTextComponents('text-accent')
export const quotePortableTextComponents: PortableTextComponents = {
  marks: {
    strong: ({children}) => <strong>{children}</strong>,
    em: ({children}) => <em>{children}</em>,
    link: linkMarkComponent,
  },
  block: {
    normal: ({children}) => <p className="rich-text-paragraph">{children}</p>,
  },
}

export function SectionTitle({value, fallback}: {value: unknown; fallback: string}) {
  return (
    <RichText
      value={value}
      fallback={fallback}
      components={headingPortableTextComponents}
      as="inline"
    />
  )
}

export function plainTextFromCms(value: unknown, fallback = ''): string {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed || fallback
  }
  if (isPortableTextValue(value)) {
    const plain = portableTextToPlainText(value).trim()
    return plain || fallback
  }
  return fallback
}

type RichTextProps = {
  value: unknown
  fallback?: string
  components?: PortableTextComponents
  as?: 'inline' | 'block'
  className?: string
}

/** Renders Portable Text, legacy string, or fallback. */
export function RichText({
  value,
  fallback,
  components = bodyPortableTextComponents,
  as = 'block',
  className,
}: RichTextProps) {
  if (isPortableTextValue(value)) {
    const content = <PortableText value={value} components={components} />
    if (as === 'inline') return className ? <span className={className}>{content}</span> : content
    return className ? <div className={className}>{content}</div> : content
  }

  const text = typeof value === 'string' && value.trim() ? value.trim() : (fallback ?? '')
  if (!text) return null
  if (as === 'inline') {
    return className ? <span className={className}>{text}</span> : <>{text}</>
  }
  return className ? <p className={className}>{text}</p> : <p>{text}</p>
}
