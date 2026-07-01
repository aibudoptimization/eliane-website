'use client'

import {useCallback, useEffect, useRef, useState} from 'react'
import {RichText, type PortableTextValue} from '@/lib/portableTextComponents'

export type BioCardItem = {
  _key?: string
  label?: string
  body?: string | PortableTextValue
}

const DURATION = 14000
const MOBILE_MQ = '(max-width: 920px)'

export function BioCardStack({cards}: {cards: BioCardItem[]}) {
  const areaRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [current, setCurrent] = useState(0)
  const [height, setHeight] = useState<number | undefined>()
  const [isMobile, setIsMobile] = useState(false)
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(true)
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    const el = cardRefs.current[current]
    if (!el || isMobile) return
    const measure = () => setHeight(el.scrollHeight)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [current, isMobile, cards])

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ)
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setIsMobile(mq.matches || motion.matches)
    update()
    mq.addEventListener('change', update)
    motion.addEventListener('change', update)
    return () => {
      mq.removeEventListener('change', update)
      motion.removeEventListener('change', update)
    }
  }, [])

  useEffect(() => {
    const el = areaRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      threshold: 0.2,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const goTo = useCallback((idx: number) => {
    setCurrent(idx)
    setAnimKey((k) => k + 1)
  }, [])

  useEffect(() => {
    if (isMobile || cards.length <= 1 || paused || !visible) return
    const id = setInterval(() => {
      setCurrent((c) => {
        const next = (c + 1) % cards.length
        setAnimKey((k) => k + 1)
        return next
      })
    }, DURATION)
    return () => clearInterval(id)
  }, [isMobile, cards.length, paused, visible])

  if (cards.length === 0) return null

  const playing = !isMobile && !paused && visible && cards.length > 1

  return (
    <div className="bio-card-block">
      {!isMobile && cards.length > 1 ? (
        <div className="bio-tabs" role="tablist" aria-label="Sections du parcours">
          {cards.map((card, i) => (
            <button
              key={card._key ?? `tab-${i}`}
              type="button"
              role="tab"
              aria-selected={i === current}
              className={`bio-tab${i === current ? ' is-active' : ''}`}
              onClick={() => goTo(i)}
            >
              <span>{card.label}</span>
              {i === current ? (
                <span
                  key={`progress-${animKey}`}
                  className={`bio-tab-progress${playing ? ' is-running' : ''}`}
                  style={{animationDuration: `${DURATION}ms`}}
                />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}

      <div
        ref={areaRef}
        className="bio-card-area"
        style={!isMobile && height ? {height} : undefined}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {cards.map((card, i) => (
          <div
            key={card._key ?? `bio-card-${i}`}
            ref={(el) => {
              cardRefs.current[i] = el
            }}
            role="tabpanel"
            className={
              isMobile
                ? 'bio-card bio-card--mobile'
                : `bio-card${i === current ? ' is-active' : ''}`
            }
          >
            {isMobile && card.label ? (
              <div className="bio-card-label">{card.label}</div>
            ) : null}
            {card.body ? (
              <div className="bio-card-body-text">
                <RichText value={card.body} className="bio-card-rich-text" />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
