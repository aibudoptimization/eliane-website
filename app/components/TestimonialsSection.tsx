'use client'

import type {ReactNode} from 'react'
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type PanInfo,
} from 'framer-motion'
import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {
  headingPortableTextComponents,
  RichText,
  type PortableTextValue,
} from '@/lib/portableTextComponents'

export type TestimonialVideoItem = {
  _key?: string
  name: string
  role: string
  videoSrc?: string
  posterSrc?: string
}

const DEFAULT_EYEBROW = 'Leur expérience'
const DEFAULT_TITLE = "Ce qu'elles en disent."

const DEFAULT_VIDEOS: TestimonialVideoItem[] = []

// Center-mode ("coverflow") sizing. Base size = center card; sides are scaled down.
const CENTER_W_DESKTOP = 210
const CENTER_H_DESKTOP = 373
const CENTER_W_MOBILE = 160
const CENTER_H_MOBILE = 284
const SPACING_RATIO = 0.95
const SIDE_SCALE = 0.72
const SIDE_OPACITY = 0.55
const FADE_END = 2

const SPRING = {type: 'spring' as const, stiffness: 420, damping: 38, mass: 0.7}

function normalizeIndex(n: number, total: number): number {
  return ((n % total) + total) % total
}

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

function textOrDefault(value: string | null | undefined, fallback: string): string {
  const trimmed = value?.trim()
  return trimmed ? trimmed : fallback
}

function renderTestimonialsTitle(value: unknown, fallback: string): ReactNode {
  return (
    <RichText
      value={value}
      fallback={fallback}
      components={headingPortableTextComponents}
      as="inline"
    />
  )
}

function MuteIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke="currentColor" strokeWidth="2" />
      <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" strokeWidth="2" />
      <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function SoundIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke="currentColor" strokeWidth="2" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
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

function useMobileDetect() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isMobile
}

function VideoCard({
  item,
  index,
  total,
  loop,
  position,
  spacing,
  width,
  height,
  isCenter,
  canPlay,
  muted,
  isMobile,
  onToggleMute,
  onMuteChange,
  onSelect,
  didDragRef,
}: {
  item: TestimonialVideoItem
  index: number
  total: number
  loop: boolean
  position: ReturnType<typeof useMotionValue<number>>
  spacing: number
  width: number
  height: number
  isCenter: boolean
  canPlay: boolean
  muted: boolean
  isMobile: boolean
  onToggleMute: () => void
  onMuteChange: (muted: boolean) => void
  onSelect: () => void
  didDragRef: {current: boolean}
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  const x = useTransform(position, (p) => ringOffset(index, p, total, loop) * spacing)
  const scale = useTransform(position, (p) => {
    const o = Math.min(Math.abs(ringOffset(index, p, total, loop)), 1)
    return 1 - (1 - SIDE_SCALE) * o
  })
  const opacity = useTransform(position, (p) => {
    const o = Math.abs(ringOffset(index, p, total, loop))
    if (o <= 1) return 1 - (1 - SIDE_OPACITY) * o
    return clamp(SIDE_OPACITY * (1 - (o - 1) / (FADE_END - 1)), 0, 1)
  })
  const zIndex = useTransform(position, (p) =>
    Math.round(100 - Math.abs(ringOffset(index, p, total, loop)) * 10),
  )
  const pointerEvents = useTransform(position, (p) =>
    Math.abs(ringOffset(index, p, total, loop)) < 1.5 ? 'auto' : 'none',
  )

  useEffect(() => {
    const video = videoRef.current
    if (!video || !item.videoSrc) return

    if (isCenter && canPlay) {
      video.muted = muted
      void video.play().catch(() => {})
      return () => {
        video.pause()
      }
    }

    video.pause()
    video.currentTime = 0
  }, [isCenter, canPlay, item.videoSrc, muted])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !isCenter) return

    const handleFullscreenChange = () => {
      const isFullscreen =
        document.fullscreenElement === video ||
        (document as any).webkitFullscreenElement === video
      if (!isFullscreen) {
        video.muted = true
        onMuteChange(true)
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
    }
  }, [isCenter, onMuteChange])

  function handleCenterTap() {
    if (!isMobile) return
    const video = videoRef.current
    if (!video) return
    video.muted = false
    onMuteChange(false)
    if (typeof (video as any).webkitEnterFullscreen === 'function') {
      ;(video as any).webkitEnterFullscreen()
    } else if (typeof video.requestFullscreen === 'function') {
      void video.requestFullscreen()
    }
    void video.play().catch(() => {})
  }

  function handleClick() {
    if (didDragRef.current) return
    if (isCenter) {
      if (isMobile) handleCenterTap()
      return
    }
    onSelect()
  }

  return (
    <motion.article
      className={`testi-vid-card testi-vid-card--${isCenter ? 'center' : 'side'}`}
      style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        width,
        height,
        marginLeft: -width / 2,
        transformOrigin: 'top center',
        x,
        scale,
        opacity,
        zIndex,
        pointerEvents,
      }}
      onClick={handleClick}
      onKeyDown={
        isCenter
          ? undefined
          : (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                if (!didDragRef.current) onSelect()
              }
            }
      }
      role={isCenter ? (isMobile ? 'button' : undefined) : 'button'}
      tabIndex={isCenter ? (isMobile ? 0 : undefined) : 0}
      aria-label={
        isCenter
          ? isMobile
            ? `Voir le témoignage de ${item.name} en plein écran`
            : undefined
          : `Voir le témoignage de ${item.name}`
      }
    >
      {item.videoSrc ? (
        <video
          ref={videoRef}
          className="testi-vid-media"
          src={item.videoSrc}
          poster={item.posterSrc}
          muted={isCenter ? muted : true}
          playsInline
          loop
          preload={isCenter ? 'auto' : 'metadata'}
        />
      ) : (
        <div className="testi-vid-placeholder" aria-hidden="true">
          {item.name}
        </div>
      )}

      <div className="testi-vid-dim" aria-hidden="true" />

      {isCenter && !isMobile ? (
        <button
          type="button"
          className="testi-mute-toggle"
          onClick={(event) => {
            event.stopPropagation()
            onToggleMute()
          }}
          aria-pressed={!muted}
        >
          {muted ? <MuteIcon /> : <SoundIcon />}
          {muted ? 'Son coupé' : 'Son activé'}
        </button>
      ) : null}

      <div className="testi-vid-footer">
        <div className="testi-vid-stars" aria-label="5 étoiles sur 5">
          ★★★★★
        </div>
        <p className="testi-vid-name">{item.name}</p>
        <p className="testi-vid-role">{item.role}</p>
      </div>
    </motion.article>
  )
}

const DEFAULT_INSTAGRAM_URL = 'https://www.instagram.com/eliane.au.naturel'

export type TestimonialsSectionProps = {
  eyebrow?: string | null
  title?: unknown
  videos?: TestimonialVideoItem[]
  instagramUrl?: string | null
}

export function TestimonialsSection({eyebrow, title, videos, instagramUrl}: TestimonialsSectionProps) {
  const resolvedInstagramUrl = instagramUrl?.trim() || DEFAULT_INSTAGRAM_URL
  const resolvedEyebrow = textOrDefault(eyebrow, DEFAULT_EYEBROW)
  const resolvedTitle = title

  const items = useMemo(() => {
    const fromSanity = videos?.filter((video) => video.name?.trim()) ?? []
    return fromSanity.length > 0 ? fromSanity : DEFAULT_VIDEOS
  }, [videos])

  const total = items.length
  const loop = total >= 3
  const isMobile = useMobileDetect()

  const [isNarrow, setIsNarrow] = useState(false)
  const [active, setActive] = useState(0)
  const [muted, setMuted] = useState(true)
  const [settled, setSettled] = useState(true)

  const reduceMotion = useReducedMotion()
  const position = useMotionValue(0)
  const panStartRef = useRef(0)
  const didDragRef = useRef(false)

  const centerW = isNarrow ? CENTER_W_MOBILE : CENTER_W_DESKTOP
  const centerH = isNarrow ? CENTER_H_MOBILE : CENTER_H_DESKTOP
  const spacing = Math.round(centerW * SPACING_RATIO)
  // Nav buttons sit just under the (scaled) side cards, matching the original layout.
  const navY = Math.round(centerH * SIDE_SCALE + 14)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    setIsNarrow(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsNarrow(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useMotionValueEvent(position, 'change', (value) => {
    if (total < 1) return
    const next = normalizeIndex(Math.round(value), total)
    setActive((prev) => (prev === next ? prev : next))
  })

  const settleTo = useCallback(
    (dest: number) => {
      setSettled(false)
      setMuted(true)
      const controls = animate(position, dest, reduceMotion ? {duration: 0} : SPRING)
      controls.finished.then(() => setSettled(true)).catch(() => {})
    },
    [position, reduceMotion],
  )

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
      settleTo(dest)
    },
    [loop, position, settleTo, total],
  )

  const goToRef = useRef(goTo)
  const activeRef = useRef(active)
  useEffect(() => {
    goToRef.current = goTo
  }, [goTo])
  useEffect(() => {
    activeRef.current = active
  }, [active])

  const onPanStart = useCallback(() => {
    if (total < 2) return
    position.stop()
    panStartRef.current = position.get()
    didDragRef.current = false
    setSettled(false)
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
      settleTo(target)
      setTimeout(() => {
        didDragRef.current = false
      }, 0)
    },
    [loop, position, settleTo, spacing, total],
  )

  return (
    <section className="section section-alt" id="temoignages">
      <div className="section-inner section-inner--testi">
        <div className="testi-header reveal" data-reveal>
          <p className="eyebrow testi-eyebrow">{resolvedEyebrow}</p>
          <h2>{renderTestimonialsTitle(resolvedTitle, DEFAULT_TITLE)}</h2>
        </div>

        {total > 0 ? (
          <>
            <div className="testi-carousel-wrap reveal" data-reveal>
              <motion.div
                className="testi-carousel"
                aria-live="polite"
                onPanStart={onPanStart}
                onPan={onPan}
                onPanEnd={onPanEnd}
                style={{height: centerH, touchAction: 'pan-y'}}
              >
                {items.map((item, index) => (
                  <VideoCard
                    key={item._key ?? `${item.name}-${index}`}
                    item={item}
                    index={index}
                    total={total}
                    loop={loop}
                    position={position}
                    spacing={spacing}
                    width={centerW}
                    height={centerH}
                    isCenter={index === active}
                    canPlay={settled}
                    muted={muted}
                    isMobile={isMobile}
                    onToggleMute={() => setMuted((value) => !value)}
                    onMuteChange={setMuted}
                    onSelect={() => goTo(index)}
                    didDragRef={didDragRef}
                  />
                ))}

                {total > 1 ? (
                  <>
                    <button
                      type="button"
                      className="testi-nav-btn testi-nav-btn--prev"
                      style={{top: navY, left: `calc(50% - ${spacing}px)`}}
                      onClick={() => goTo(active - 1)}
                      aria-label="Témoignage précédent"
                    >
                      <NavArrow direction="prev" />
                    </button>
                    <button
                      type="button"
                      className="testi-nav-btn testi-nav-btn--next"
                      style={{top: navY, left: `calc(50% + ${spacing}px)`}}
                      onClick={() => goTo(active + 1)}
                      aria-label="Témoignage suivant"
                    >
                      <NavArrow direction="next" />
                    </button>
                  </>
                ) : null}
              </motion.div>
            </div>

            <div className="testi-dots reveal" data-reveal role="tablist" aria-label="Choisir un témoignage">
              {items.map((video, index) => (
                <button
                  key={video._key ?? `${video.name}-${index}`}
                  type="button"
                  className={`testi-dot${index === active ? ' is-active' : ''}`}
                  onClick={() => goTo(index)}
                  role="tab"
                  aria-selected={index === active}
                  aria-label={`Témoignage ${index + 1} : ${video.name}`}
                />
              ))}
            </div>
          </>
        ) : (
          <p className="testi-empty">
            Les témoignages vidéo arrivent bientôt.{" "}
            <a
              href={resolvedInstagramUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Retrouve les retours de clientes sur Instagram.
            </a>
          </p>
        )}
      </div>
    </section>
  )
}
