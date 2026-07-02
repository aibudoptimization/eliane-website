/** Active homePage section when editing from Aperçu du site (not in structure URLs). */

let activeSectionId: string | null = null
const listeners = new Set<() => void>()

export function setPresentationSection(sectionId: string | null) {
  activeSectionId = sectionId
  listeners.forEach((listener) => listener())
}

export function subscribePresentationSection(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getPresentationSection() {
  return activeSectionId
}
