'use client'

import {useCallback, useEffect, useRef, useState} from 'react'
import {renderBoldText} from '@/lib/renderBoldText'

export type BioCardItem = {
  _key?: string
  label?: string
  body?: string
}

const DURATION = 9000
const PEEL_MS = 1350
const RING_CIRCUMFERENCE = 75.4
const MOBILE_MQ = '(max-width: 920px)'

function CardTimerRing({active}: {active: boolean}) {
  const ringRef = useRef<SVGCircleElement>(null)

  useEffect(() => {
    const ring = ringRef.current
    if (!ring || !active) return

    ring.style.transition = 'none'
    ring.style.strokeDashoffset = String(RING_CIRCUMFERENCE)

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ring.style.transition = `stroke-dashoffset ${DURATION - 1400}ms linear`
        ring.style.strokeDashoffset = '0'
      })
    })

    return () => cancelAnimationFrame(frame)
  }, [active])

  return (
    <div className="bio-card-timer" aria-hidden="true">
      <svg viewBox="0 0 32 32">
        <circle className="track" cx="16" cy="16" r="12" />
        <circle ref={ringRef} className="ring" cx="16" cy="16" r="12" />
      </svg>
    </div>
  )
}

type CardState = 'past' | 'active' | 'peeling' | 'revealing'

function cardClass(state: CardState | undefined): string {
  const base = 'bio-card'
  if (state === 'active') return `${base} is-active`
  if (state === 'past') return `${base} is-past`
  if (state === 'peeling') return `${base} is-peeling`
  if (state === 'revealing') return `${base} is-revealing`
  return base
}

export function BioCardStack({cards}: {cards: BioCardItem[]}) {
  const areaRef = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)
  const [cardStates, setCardStates] = useState<CardState[]>(() =>
    cards.map((_, i) => (i === 0 ? 'active' : 'past')),
  )
  const [ringKey, setRingKey] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [paused, setPaused] = useState(false)
  const currentRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const peelTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    currentRef.current = current
  }, [current])

  useEffect(() => {
    const mobileMq = window.matchMedia(MOBILE_MQ)
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setIsMobile(mobileMq.matches || motionMq.matches)
    update()
    mobileMq.addEventListener('change', update)
    motionMq.addEventListener('change', update)
    return () => {
      mobileMq.removeEventListener('change', update)
      motionMq.removeEventListener('change', update)
    }
  }, [])

  const settleClasses = useCallback((idx: number) => {
    setCardStates(
      cards.map((_, i) => {
        if (i === idx) return 'active'
        return 'past'
      }),
    )
    setRingKey((k) => k + 1)
  }, [cards])

  const showCard = useCallback(
    (idx: number, animate: boolean) => {
      const fromIdx = currentRef.current
      setCurrent(idx)
      currentRef.current = idx

      if (!animate || fromIdx === idx || isMobile) {
        settleClasses(idx)
        return
      }

      setCardStates(
        cards.map((_, i) => {
          if (i === fromIdx) return 'peeling'
          if (i === idx) return 'revealing'
          return 'past'
        }),
      )

      if (peelTimeoutRef.current) clearTimeout(peelTimeoutRef.current)
      peelTimeoutRef.current = setTimeout(() => {
        settleClasses(idx)
      }, PEEL_MS)
    },
    [cards, isMobile, settleClasses],
  )

  useEffect(() => {
    if (isMobile || cards.length <= 1) return

    timerRef.current = setInterval(() => {
      if (paused) return
      const next = (currentRef.current + 1) % cards.length
      showCard(next, true)
    }, DURATION)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (peelTimeoutRef.current) clearTimeout(peelTimeoutRef.current)
    }
  }, [cards.length, isMobile, paused, showCard])

  const jumpTo = (idx: number) => {
    showCard(idx, true)
    if (timerRef.current) clearInterval(timerRef.current)
    if (!isMobile && cards.length > 1) {
      timerRef.current = setInterval(() => {
        if (paused) return
        const next = (currentRef.current + 1) % cards.length
        showCard(next, true)
      }, DURATION)
    }
  }

  if (cards.length === 0) return null

  return (
    <div
      ref={areaRef}
      className="bio-card-area"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {cards.map((card, i) => (
        <div
          key={card._key ?? `bio-card-${i}`}
          className={isMobile ? 'bio-card bio-card--mobile' : cardClass(cardStates[i])}
          data-card={i}
        >
          {card.label ? <div className="bio-card-label">{card.label}</div> : null}
          {card.body ? <p>{renderBoldText(card.body)}</p> : null}
          {!isMobile && cardStates[i] === 'active' ? (
            <CardTimerRing key={`ring-${i}-${ringKey}`} active />
          ) : !isMobile ? (
            <div className="bio-card-timer" aria-hidden="true">
              <svg viewBox="0 0 32 32">
                <circle className="track" cx="16" cy="16" r="12" />
                <circle className="ring" cx="16" cy="16" r="12" />
              </svg>
            </div>
          ) : null}
        </div>
      ))}

      {!isMobile && cards.length > 1 ? (
        <div className="bio-progress" role="tablist" aria-label="Cartes biographie">
          {cards.map((_, i) => (
            <button
              key={`bio-flag-${i}`}
              type="button"
              className={`bio-progress-dot${i === current ? ' is-active' : ''}`}
              aria-label={`Carte ${i + 1}`}
              aria-selected={i === current}
              role="tab"
              onClick={() => jumpTo(i)}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
