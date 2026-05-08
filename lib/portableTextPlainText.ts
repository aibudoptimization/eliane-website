type PtChild = {
  _type?: string
  text?: string
  children?: PtChild[]
}

type PtBlock = {
  _type?: string
  children?: PtChild[]
}

function walk(nodes: PtChild[] | undefined): string {
  if (!nodes?.length) return ''
  return nodes
    .map((node) => {
      if (node._type === 'span' && typeof node.text === 'string') return node.text
      if (node.children?.length) return walk(node.children)
      return ''
    })
    .join('')
}

/** Flatten portable text blocks to plain string (e.g. JSON-LD). */
export function portableTextToPlainText(value: unknown): string {
  if (value == null) return ''
  if (typeof value === 'string') return value
  if (!Array.isArray(value)) return ''
  return (value as PtBlock[])
    .map((block) => (block._type === 'block' ? walk(block.children) : ''))
    .filter(Boolean)
    .join(' ')
    .trim()
}
