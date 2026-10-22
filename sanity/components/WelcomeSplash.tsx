'use client'

import {useEffect, useState, useSyncExternalStore} from 'react'

const STORAGE_KEY = 'eliane-studio-welcome-v1'
const DISPLAY_MS = 2600

const subscribeNever = () => () => {}

export function WelcomeSplash() {
  // Read sessionStorage only in the browser; the server render treats the splash as already seen.
  const alreadySeen = useSyncExternalStore(
    subscribeNever,
    () => sessionStorage.getItem(STORAGE_KEY) === '1',
    () => true,
  )
  const [dismissed, setDismissed] = useState(false)
  const visible = !alreadySeen && !dismissed

  useEffect(() => {
    if (!visible) return
    const timer = window.setTimeout(() => {
      sessionStorage.setItem(STORAGE_KEY, '1')
      setDismissed(true)
    }, DISPLAY_MS)

    return () => window.clearTimeout(timer)
  }, [visible])

  if (!visible) return null

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(246, 241, 234, 0.96)',
        pointerEvents: 'none',
      }}
    >
      <div style={{textAlign: 'center', padding: '0 24px'}}>
        <p
          style={{
            margin: 0,
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontStyle: 'italic',
            fontSize: 'clamp(1.75rem, 5vw, 2.35rem)',
            color: '#1a1410',
            lineHeight: 1.25,
          }}
        >
          Bienvenue, Éliane!
        </p>
        <p
          style={{
            margin: '12px 0 0',
            fontFamily: 'system-ui, sans-serif',
            fontSize: '0.95rem',
            color: '#5a5048',
            letterSpacing: '0.02em',
          }}
        >
          Ton studio est prêt.
        </p>
      </div>
    </div>
  )
}
