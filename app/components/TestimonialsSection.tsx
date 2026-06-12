'use client'

import type {ReactNode} from 'react'
import {useCallback, useEffect, useMemo, useRef, useState} from 'react'

export type TestimonialVideoItem = {
  _key?: string
  name: string
  role: string
  videoSrc?: string
  posterSrc?: string
}

const DEFAULT_EYEBROW = 'Leur expérience'
const DEFAULT_TITLE = "Ce qu'elles en disent."

const DEFAULT_VIDEOS: TestimonialVideoItem[] = [
  {name: 'Claudie Larose', role: 'Cliente'},
  {name: 'Erwanne Frenette', role: 'Cliente'},
  {name: 'Laurie Ciorra', role: 'Cliente'},
  {name: 'Cliente 4', role: 'Cliente'},
]

function textOrDefault(value: string | null | undefined, fallback: string): string {
  const trimmed = value?.trim()
  return trimmed ? trimmed : fallback
}

function renderTestimonialsTitle(text: string): ReactNode {
  const match = text.match(/^(.*?)(elles)(.*)$/i)
  if (!match) return text
  return (
    <>
      {match[1]}
      <em>{match[2]}</em>
      {match[3]}
    </>
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

function VideoCard({
  item,
  position,
  muted,
  onToggleMute,
  onSelect,
}: {
  item: TestimonialVideoItem
  position: 'side' | 'center'
  muted: boolean
  onToggleMute: () => void
  onSelect: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const isCenter = position === 'center'

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

  return (
    <article
      className={`testi-vid-card testi-vid-card--${position}`}
      onClick={isCenter ? undefined : onSelect}
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
      role={isCenter ? undefined : 'button'}
      tabIndex={isCenter ? undefined : 0}
      aria-label={isCenter ? undefined : `Voir le témoignage de ${item.name}`}
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

      {isCenter ? (
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

export type TestimonialsSectionProps = {
  eyebrow?: string | null
  title?: string | null
  videos?: TestimonialVideoItem[]
}

export function TestimonialsSection({eyebrow, title, videos}: TestimonialsSectionProps) {
  const resolvedEyebrow = textOrDefault(eyebrow, DEFAULT_EYEBROW)
  const resolvedTitle = textOrDefault(title, DEFAULT_TITLE)

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
          <h2>{renderTestimonialsTitle(resolvedTitle)}</h2>
        </div>

        {total > 0 ? (
          <>
            <div className="testi-carousel-wrap reveal" data-reveal>
              <div className="testi-carousel" aria-live="polite">
                {visible.map(({item, position, index}, slot) => (
                  <div className="testi-carousel-slot" key={`testi-slot-${slot}-${active}`}>
                    <VideoCard
                      item={item}
                      position={position}
                      muted={muted}
                      onToggleMute={() => setMuted((value) => !value)}
                      onSelect={() => goTo(index)}
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
          <p className="testi-empty">Les témoignages vidéo seront disponibles bientôt.</p>
        )}
      </div>
    </section>
  )
}
