'use client'

import type {ReactNode} from 'react'
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
  position,
  muted,
  onToggleMute,
  onSelect,
  onMuteChange,
}: {
  item: TestimonialVideoItem
  position: 'side' | 'center'
  muted: boolean
  onToggleMute: () => void
  onSelect: () => void
  onMuteChange: (muted: boolean) => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const isCenter = position === 'center'
  const isMobile = useMobileDetect()

  useEffect(() => {
    const video = videoRef.current
    if (!video || !item.videoSrc) return

    if (isCenter) {
      video.muted = muted
      void video.play().catch(() => {})
      return () => {
        video.pause()
      }
    }

    video.pause()
    video.currentTime = 0
  }, [isCenter, item.videoSrc, muted])

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

  return (
    <article
      className={`testi-vid-card testi-vid-card--${position}`}
      onClick={isCenter ? (isMobile ? handleCenterTap : undefined) : onSelect}
      onKeyDown={
        isCenter
          ? undefined
          : (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onSelect()
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
    </article>
  )
}

const DEFAULT_INSTAGRAM_URL = 'https://www.instagram.com/eliane.au.naturel'

export type TestimonialsSectionProps = {
  eyebrow?: string | null
  title?: unknown
  videos?: TestimonialVideoItem[]
  instagramUrl?: string | null
}

const SWIPE_THRESHOLD = 40

export function TestimonialsSection({eyebrow, title, videos, instagramUrl}: TestimonialsSectionProps) {
  const resolvedInstagramUrl = instagramUrl?.trim() || DEFAULT_INSTAGRAM_URL
  const resolvedEyebrow = textOrDefault(eyebrow, DEFAULT_EYEBROW)
  const resolvedTitle = title

  const items = useMemo(() => {
    const fromSanity = videos?.filter((video) => video.name?.trim()) ?? []
    return fromSanity.length > 0 ? fromSanity : DEFAULT_VIDEOS
  }, [videos])

  const total = items.length
  const [active, setActive] = useState(0)
  const [muted, setMuted] = useState(true)

  const goTo = useCallback(
    (index: number) => {
      if (total < 1) return
      setActive(((index % total) + total) % total)
      setMuted(true)
    },
    [total],
  )

  // Keep fresh refs so the native touch listener closure never goes stale
  const carouselWrapRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef(active)
  const goToRef = useRef(goTo)
  useEffect(() => { activeRef.current = active }, [active])
  useEffect(() => { goToRef.current = goTo }, [goTo])

  // Attach non-passive touchend so we can preventDefault() to suppress the
  // subsequent click (which would trigger center-video fullscreen on mobile)
  useEffect(() => {
    const el = carouselWrapRef.current
    if (!el) return

    let startX = 0
    let startY = 0

    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0]?.clientX ?? 0
      startY = e.touches[0]?.clientY ?? 0
    }

    const onTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0]
      if (!touch) return
      const deltaX = touch.clientX - startX
      const deltaY = touch.clientY - startY
      // Only treat as a horizontal swipe if it dominates the vertical movement
      if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) < Math.abs(deltaY)) return
      // Prevent the ghost click that would fire after touchend
      e.preventDefault()
      if (deltaX < 0) {
        goToRef.current(activeRef.current + 1)
      } else {
        goToRef.current(activeRef.current - 1)
      }
    }

    el.addEventListener('touchstart', onTouchStart, {passive: true})
    el.addEventListener('touchend', onTouchEnd, {passive: false})

    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, []) // intentionally empty — kept fresh via activeRef / goToRef

  const visible = useMemo(() => {
    if (total < 1) return []
    return [
      {
        item: items[(active - 1 + total) % total]!,
        position: 'side' as const,
        index: (active - 1 + total) % total,
      },
      {item: items[active]!, position: 'center' as const, index: active},
      {item: items[(active + 1) % total]!, position: 'side' as const, index: (active + 1) % total},
    ]
  }, [active, items, total])

  return (
    <section className="section section-alt" id="temoignages">
      <div className="section-inner section-inner--testi">
        <div className="testi-header reveal" data-reveal>
          <p className="eyebrow testi-eyebrow">{resolvedEyebrow}</p>
          <h2>{renderTestimonialsTitle(resolvedTitle, DEFAULT_TITLE)}</h2>
        </div>

        {total > 0 ? (
          <>
            <div className="testi-carousel-wrap reveal" data-reveal ref={carouselWrapRef}>
              <div className="testi-carousel" aria-live="polite">
                {visible.map(({item, position, index}, slot) => (
                  <div className="testi-carousel-slot" key={`testi-slot-${slot}-${active}`}>
                    <VideoCard
                      item={item}
                      position={position}
                      muted={muted}
                      onToggleMute={() => setMuted((value) => !value)}
                      onSelect={() => goTo(index)}
                      onMuteChange={setMuted}
                    />
                    {slot === 0 ? (
                      <button
                        type="button"
                        className="testi-nav-btn testi-nav-btn--slot"
                        onClick={() => goTo(active - 1)}
                        aria-label="Témoignage précédent"
                      >
                        <NavArrow direction="prev" />
                      </button>
                    ) : null}
                    {slot === 2 ? (
                      <button
                        type="button"
                        className="testi-nav-btn testi-nav-btn--slot"
                        onClick={() => goTo(active + 1)}
                        aria-label="Témoignage suivant"
                      >
                        <NavArrow direction="next" />
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
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
