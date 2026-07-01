'use client'

import {useEffect, useRef, useSyncExternalStore} from 'react'
import type {InputProps, ObjectInputProps} from 'sanity'
import {resolveHomePageGroupFromLocation} from '../homePageSections'

function subscribeToPathname(onStoreChange: () => void) {
  if (typeof window === 'undefined') return () => undefined

  const originalPushState = history.pushState.bind(history)
  const originalReplaceState = history.replaceState.bind(history)
  const notify = () => onStoreChange()

  history.pushState = (...args) => {
    originalPushState(...args)
    notify()
  }
  history.replaceState = (...args) => {
    originalReplaceState(...args)
    notify()
  }

  window.addEventListener('popstate', notify)
  return () => {
    history.pushState = originalPushState
    history.replaceState = originalReplaceState
    window.removeEventListener('popstate', notify)
  }
}

function getPathnameSnapshot() {
  return typeof window === 'undefined' ? '' : window.location.pathname
}

function isHomePageDocumentRoot(props: InputProps) {
  return (
    props.id === 'root' &&
    props.schemaType?.name === 'homePage' &&
    props.schemaType?.type?.name === 'document'
  )
}

/**
 * When opened from a sidebar section shortcut, selects the matching field group tab.
 * Must wrap the document root input (`props.id === 'root'`), not individual fields.
 */
export function HomePageDocumentInput(props: InputProps) {
  const pathname = useSyncExternalStore(subscribeToPathname, getPathnameSnapshot, () => '')
  const lastGroup = useRef<string | null>(null)
  const group = resolveHomePageGroupFromLocation(pathname)
  const isRoot = isHomePageDocumentRoot(props)
  const onFieldGroupSelect = isRoot
    ? (props as ObjectInputProps).onFieldGroupSelect
    : undefined

  useEffect(() => {
    if (!isRoot || typeof onFieldGroupSelect !== 'function') return

    if (!group) {
      if (lastGroup.current !== null) {
        onFieldGroupSelect('default')
        lastGroup.current = null
      }
      return
    }

    if (group === lastGroup.current) return

    onFieldGroupSelect(group)
    lastGroup.current = group
  }, [group, isRoot, onFieldGroupSelect])

  return props.renderDefault(props)
}
