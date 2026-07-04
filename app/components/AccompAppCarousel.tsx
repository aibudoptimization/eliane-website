'use client'

import Image from 'next/image'
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type PanInfo,
} from 'framer-motion'
import {useCallback, useEffect, useId, useMemo, useRef, useState} from 'react'
import {createPortal} from 'react-dom'

export type AppScreenItem = {
  _key?: string
  src: string
  lightboxSrc: string
  alt: string
  caption: string
}

const IMG_W = 965
const IMG_H = 1948
const ASPECT = IMG_H / IMG_W

const CENTER_W_DESKTOP = 158
const CENTER_W_MOBILE = 134
const SPACING_RATIO = 0.82 // gap between phone centers, relative to center width
const SIDE_SCALE = 0.72
const FADE_END = 2 // offset (in phones) at which a phone is fully faded out

function normalizeIndex(n: number, total: number): number {
  return ((n % total) + total) % total
}

/** Signed distance (in phones) of `index` from continuous position `pos`.
 *  When looping, returns the shortest path around the ring. */
function ringOffset(index: number, pos: number, total: number, loop: boolean): number {
  let d = index - pos
  if (loop) {
    d = ((d % total) + total) % total
    if (d > total / 2) d -= total
  }
  return d
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function NavArrow({direction}: {direction: 'prev' | 'next'}) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <polyline
        points={direction === 'prev' ? '15 18 9 12 15 6' : '9 18 15 12 9 6'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ExpandIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function CoverPhone({
  item,
  index,
  total,
  loop,
  position,
  spacing,
  width,
  height,
  isCenter,
  onSelect,
  onExpand,
}: {
  item: AppScreenItem
  index: number
  total: number
  loop: boolean
  position: ReturnType<typeof useMotionValue<number>>
  spacing: number
  width: number
  height: number
  isCenter: boolean
  onSelect: () => void
  onExpand: () => void
}) {
  const x = useTransform(position, (p) => ringOffset(index, p, total, loop) * spacing)
  const scale = useTransform(position, (p) => {
    const o = Math.min(Math.abs(ringOffset(index, p, total, loop)), 1)
    return 1 - (1 - SIDE_SCALE) * o
  })
  const opacity = useTransform(position, (p) => {
    const o = Math.abs(ringOffset(index, p, total, loop))
    if (o <= 1) return 1
    return clamp(1 - (o - 1) / (FADE_END - 1), 0, 1)
  })
  const zIndex = useTransform(position, (p) =>
    Math.round(100 - Math.abs(ringOffset(index, p, total, loop)) * 10),
  )
  const pointerEvents = useTransform(position, (p) =>
    Math.abs(ringOffset(index, p, total, loop)) < 1.5 ? 'auto' : 'none',
  )

  return (
    <motion.div
      className="accomp-phone-card"
      style={{
        width,
        height,
        x,
        scale,
        opacity,
        zIndex,
        pointerEvents,
        marginLeft: -width / 2,
        marginTop: -height / 2,
      }}
    >
      <button
        type="button"
        className={`accomp-phone-btn${isCenter ? ' is-center' : ''}`}
        onClick={isCenter ? onExpand : onSelect}
        aria-label={isCenter ? `Agrandir l'écran : ${item.caption}` : `Voir l'écran : ${item.caption}`}
        tabIndex={Math.abs(index) > total ? -1 : 0}
      >
        <Image
          className="accomp-phone-img"
          src={item.src}
          alt={item.alt}
          fill
          sizes="(max-width: 920px) 45vw, 180px"
          draggable={false}
          priority={isCenter}
        />
        {isCenter ? (
          <span className="accomp-phone-expand" aria-hidden="true">
            <ExpandIcon />
          </span>
        ) : null}
      </button>
    </motion.div>
  )
}

type AccompAppCarouselProps = {
  screens: AppScreenItem[]
}

const SPRING = {type: 'spring' as const, stiffness: 420, damping: 38, mass: 0.7}

export function AccompAppCarousel({screens}: AccompAppCarouselProps) {
  const items = useMemo(() => screens.filter((screen) => screen.src?.trim()), [screens])
  const total = items.length
  const loop = total >= 3

  const [isNarrow, setIsNarrow] = useState(false)
  const [active, setActive] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const titleId = useId()

  const reduceMotion = useReducedMotion()
  const position = useMotionValue(0)
  const panStartRef = useRef(0)
  const didDragRef = useRef(false)

  const centerW = isNarrow ? CENTER_W_MOBILE : CENTER_W_DESKTOP
  const centerH = Math.round(centerW * ASPECT)
  const spacing = Math.round(centerW * SPACING_RATIO)
  // Vertical position of the nav buttons: fully below the (scaled) side phones.
  const navY = Math.round(centerH / 2 + (centerH * SIDE_SCALE) / 2 + 22)

  useEffect(() => {
    setMounted(true)
    const mq = window.matchMedia('(max-width: 920px)')
    setIsNarrow(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsNarrow(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Keep `active` (used for caption, dots, lightbox) synced to the animated position.
  useMotionValueEvent(position, 'change', (value) => {
    if (total < 1) return
    const next = normalizeIndex(Math.round(value), total)
    setActive((prev) => (prev === next ? prev : next))
  })

  const goTo = useCallback(
    (index: number) => {
      if (total < 1) return
      const from = position.get()
      const base = Math.round(from)
      let dest: number
      if (loop) {
        let delta = index - normalizeIndex(base, total)
        delta = ((delta % total) + total) % total
        if (delta > total / 2) delta -= total
        dest = base + delta
      } else {
        dest = clamp(index, 0, total - 1)
      }
      animate(position, dest, reduceMotion ? {duration: 0} : SPRING)
    },
    [loop, position, reduceMotion, total],
  )

  const goToRef = useRef(goTo)
  const activeRef = useRef(active)
  useEffect(() => {
    goToRef.current = goTo
  }, [goTo])
  useEffect(() => {
    activeRef.current = active
  }, [active])

  const closeLightbox = useCallback(() => setLightboxOpen(false), [])

  useEffect(() => {
    if (!lightboxOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeLightbox()
      if (event.key === 'ArrowLeft') goToRef.current(activeRef.current - 1)
      if (event.key === 'ArrowRight') goToRef.current(activeRef.current + 1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [closeLightbox, lightboxOpen])

  const onPanStart = useCallback(() => {
    if (total < 2) return
    position.stop()
    panStartRef.current = position.get()
    didDragRef.current = false
  }, [position, total])

  const onPan = useCallback(
    (_event: PointerEvent, info: PanInfo) => {
      if (total < 2) return
      if (Math.abs(info.offset.x) > 5) didDragRef.current = true
      let next = panStartRef.current - info.offset.x / spacing
      if (!loop) next = clamp(next, 0, total - 1)
      position.set(next)
    },
    [loop, position, spacing, total],
  )

  const onPanEnd = useCallback(
    (_event: PointerEvent, info: PanInfo) => {
      if (total < 2) return
      const projected = position.get() - (info.velocity.x / spacing) * 0.18
      let target = Math.round(projected)
      if (!loop) target = clamp(target, 0, total - 1)
      animate(position, target, reduceMotion ? {duration: 0} : SPRING)
      // Release the drag guard on the next tick so the click handler can skip a drag.
      setTimeout(() => {
        didDragRef.current = false
      }, 0)
    },
    [loop, position, reduceMotion, spacing, total],
  )

  const handleSelect = useCallback(
    (index: number) => {
      if (didDragRef.current) return
      goTo(index)
    },
    [goTo],
  )

  const handleExpand = useCallback(() => {
    if (didDragRef.current) return
    setLightboxOpen(true)
  }, [])

  const activeItem = items[active]
  if (total < 1 || !activeItem) return null

  return (
    <div className="accomp-app-carousel">
      <div className="accomp-carousel-wrap" style={{height: centerH}}>
        <motion.div
          className="accomp-carousel"
          onPanStart={onPanStart}
          onPan={onPan}
          onPanEnd={onPanEnd}
          style={{touchAction: 'pan-y'}}
        >
          {items.map((item, index) => (
            <CoverPhone
              key={item._key ?? `${item.caption}-${index}`}
              item={item}
              index={index}
              total={total}
              loop={loop}
              position={position}
              spacing={spacing}
              width={centerW}
              height={centerH}
              isCenter={index === active}
              onSelect={() => handleSelect(index)}
              onExpand={handleExpand}
            />
          ))}
        </motion.div>

        {total > 1 ? (
          <>
            <button
              type="button"
              className="accomp-nav-btn accomp-nav-btn--prev"
              style={{top: navY, left: `calc(50% - ${spacing}px)`, right: 'auto'}}
              onClick={() => goTo(active - 1)}
              aria-label="Écran précédent"
            >
              <NavArrow direction="prev" />
            </button>
            <button
              type="button"
              className="accomp-nav-btn accomp-nav-btn--next"
              style={{top: navY, left: `calc(50% + ${spacing}px)`, right: 'auto'}}
              onClick={() => goTo(active + 1)}
              aria-label="Écran suivant"
            >
              <NavArrow direction="next" />
            </button>
          </>
        ) : null}
      </div>

      <p className="accomp-phone-caption">{activeItem.caption}</p>

      {total > 1 ? (
        <div className="accomp-dots" role="tablist" aria-label="Choisir un écran de l'application">
          {items.map((screen, index) => (
            <button
              key={screen._key ?? `${screen.caption}-${index}`}
              type="button"
              className={`accomp-dot${index === active ? ' is-active' : ''}`}
              onClick={() => goTo(index)}
              role="tab"
              aria-selected={index === active}
              aria-label={`Écran ${index + 1} : ${screen.caption}`}
            />
          ))}
        </div>
      ) : null}

      {mounted && lightboxOpen
        ? createPortal(
            <div
              className="accomp-lightbox"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              onClick={closeLightbox}
            >
              <div className="accomp-lightbox-inner" onClick={(event) => event.stopPropagation()}>
                <button
                  type="button"
                  className="accomp-lightbox-close"
                  onClick={closeLightbox}
                  aria-label="Fermer l'image agrandie"
                >
                  <CloseIcon />
                </button>
                <p id={titleId} className="sr-only">
                  {activeItem.alt}
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="accomp-lightbox-img" src={activeItem.lightboxSrc} alt={activeItem.alt} />
                {total > 1 ? (
                  <>
                    <button
                      type="button"
                      className="accomp-lightbox-nav accomp-lightbox-nav--prev"
                      onClick={() => goTo(active - 1)}
                      aria-label="Écran précédent"
                    >
                      <NavArrow direction="prev" />
                    </button>
                    <button
                      type="button"
                      className="accomp-lightbox-nav accomp-lightbox-nav--next"
                      onClick={() => goTo(active + 1)}
                      aria-label="Écran suivant"
                    >
                      <NavArrow direction="next" />
                    </button>
                  </>
                ) : null}
                <p className="accomp-lightbox-caption">{activeItem.caption}</p>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}
