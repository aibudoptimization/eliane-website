'use client'

import {useEffect, useState} from 'react'
import {RichText} from '@/lib/portableTextComponents'
import type {PresentielCard} from '@/app/components/PresentielSection'

export type PresentielIconName = 'check' | 'shield' | 'clock' | 'eye'

const MOBILE_MQ = '(max-width: 920px)'

const LEGACY_ICON_MAP: Record<string, PresentielIconName> = {
  eye: 'check',
  'shield-check': 'shield',
  'calendar-check': 'clock',
  activity: 'eye',
}

export function normalizeIconName(value: string | undefined): PresentielIconName {
  if (value === 'check' || value === 'shield' || value === 'clock' || value === 'eye') {
    return value
  }
  if (value && LEGACY_ICON_MAP[value]) return LEGACY_ICON_MAP[value]
  return 'check'
}

function PresentielCardIcon({name}: {name: PresentielIconName}) {
  const props = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }

  switch (name) {
    case 'shield':
      return (
        <svg {...props}>
          <path d="M12 2L4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4z" />
        </svg>
      )
    case 'clock':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <polyline points="12 7 12 12 15 14" />
        </svg>
      )
    case 'eye':
      return (
        <svg {...props}>
          <path d="M3 12s3-7 9-7 9 7 9 7-3 7-9 7-9-7-9-7z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      )
  }
}

export function PresentielCards({items}: {items: PresentielCard[]}) {
  const [isMobile, setIsMobile] = useState(false)
  const [openKeys, setOpenKeys] = useState<Set<number>>(new Set())

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ)
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const toggle = (index: number) =>
    setOpenKeys((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })

  return (
    <div className="presentiel-cards reveal-stagger" data-reveal>
      {items.map((card, index) => {
        const isOpen = openKeys.has(index)
        const key = card._key ?? `presentiel-card-${index}`
        const panelId = `presentiel-panel-${key}`
        const icon = <PresentielCardIcon name={normalizeIconName(card.iconName)} />
        return (
          <article
            className={`presentiel-card${isMobile ? ' presentiel-card--mobile' : ''}${
              isOpen ? ' is-open' : ''
            }`}
            key={key}
          >
            {isMobile ? (
              <button
                type="button"
                className="presentiel-card-header presentiel-card-toggle"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(index)}
              >
                {icon}
                {card.title ? <h3 className="presentiel-card-title">{card.title}</h3> : null}
                <span className="presentiel-card-chevron" aria-hidden="true" />
              </button>
            ) : (
              <div className="presentiel-card-header">
                {icon}
                {card.title ? <h3 className="presentiel-card-title">{card.title}</h3> : null}
              </div>
            )}
            {card.description ? (
              <div className="presentiel-card-body" id={panelId}>
                <div className="presentiel-card-body-inner">
                  <RichText value={card.description} className="presentiel-card-desc" />
                </div>
              </div>
            ) : null}
          </article>
        )
      })}
    </div>
  )
}
