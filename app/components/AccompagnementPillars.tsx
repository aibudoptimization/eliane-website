'use client'

import {useEffect, useState} from 'react'
import {RichText, type PortableTextValue} from '@/lib/portableTextComponents'

type Pillar = {_key?: string; title?: string; description?: string | PortableTextValue}

const MOBILE_MQ = '(max-width: 920px)'

export function AccompagnementPillars({items}: {items: Pillar[]}) {
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
    <div className="accomp-timeline reveal-stagger" data-reveal>
      {items.map((pillar, index) => {
        const isOpen = openKeys.has(index)
        const key = pillar._key ?? `pillar-${index}`
        const panelId = `accomp-panel-${key}`
        return (
          <div
            className={`accomp-tl-item${isMobile ? ' accomp-tl-item--mobile' : ''}${
              isOpen ? ' is-open' : ''
            }`}
            key={key}
          >
            <div className="accomp-tl-dot">{index + 1}</div>
            <div className="accomp-tl-body">
              {pillar.title ? (
                isMobile ? (
                  <button
                    type="button"
                    className="accomp-tl-title accomp-tl-toggle"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(index)}
                  >
                    <span>{pillar.title}</span>
                    <span className="accomp-tl-chevron" aria-hidden="true" />
                  </button>
                ) : (
                  <h3 className="accomp-tl-title">{pillar.title}</h3>
                )
              ) : null}
              {pillar.description ? (
                <div className="accomp-tl-desc-wrap" id={panelId}>
                  <RichText value={pillar.description} className="accomp-tl-desc" />
                </div>
              ) : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}
