'use client'

import {useRef, useEffect, useCallback, useState} from 'react'
import {ProcessSnakeGraphic, type SnakeCoords} from '@/app/components/ProcessDrawGraphics'
import {CAL_EMBED_DATA_CONFIG} from '@/lib/cal-embed-init'
import {RichText, SectionTitle, type PortableTextValue} from '@/lib/portableTextComponents'

export type AfterCallStep = {
  _key?: string
  title?: string
  description?: string | PortableTextValue
}

const DEFAULT_EYEBROW = 'Comment ça se passe'
const DEFAULT_TITLE = "Après l'appel découverte."
const DEFAULT_INTRO =
  "L'appel est gratuit, sans engagement, et sert d'abord à voir si l'accompagnement est réellement pertinent pour toi."
const DEFAULT_CTA = "Je suis prête à avoir plus d'informations"

const DEFAULT_STEPS: AfterCallStep[] = [
  {
    title: 'Comprendre où tu en es',
    description:
      "On prend le temps de regarder ton point de départ : ton historique d'entraînement, ton mode de vie et ce qui t'a freinée par le passé.",
  },
  {
    title: 'Clarifier tes objectifs',
    description:
      'On met des mots précis sur ce que tu veux vraiment atteindre, et sur ce qui compte pour toi à long terme.',
  },
  {
    title: "Voir si l'accompagnement est adapté",
    description: "Je te dirai honnêtement si ce que j'offre correspond à ce que tu cherches — ou pas.",
  },
  {
    title: 'Répondre à tes questions',
    description:
      'Tu peux poser tout ce que tu veux : logistique, fréquence, méthode, prix. Aucune question n\'est de trop.',
  },
  {
    title: 'Te recommander la meilleure prochaine étape',
    description: 'Que ce soit avec moi ou ailleurs, tu repars avec une direction claire pour avancer.',
  },
]

function textOrDefault(value: string | null | undefined, fallback: string): string {
  const trimmed = value?.trim()
  return trimmed ? trimmed : fallback
}

function CtaArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <polyline
        points="12 5 19 12 12 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export type AfterCallSectionProps = {
  eyebrow?: string | null
  title?: unknown
  intro?: unknown
  steps?: AfterCallStep[]
  ctaLabel?: string | null
  ctaUrl: string
  calLinkNamespace?: string
}

export function AfterCallSection({
  eyebrow,
  title,
  intro,
  steps,
  ctaLabel,
  ctaUrl,
  calLinkNamespace,
}: AfterCallSectionProps) {
  const filteredSteps =
    steps?.filter((step) => step?.title?.trim() || step?.description) ?? []
  const resolvedSteps = filteredSteps.length >= 5 ? filteredSteps.slice(0, 5) : DEFAULT_STEPS

  const wrapRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null, null])
  const [snakeCoords, setSnakeCoords] = useState<SnakeCoords | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const measure = useCallback(() => {
    const wrap = wrapRef.current
    if (!wrap || cardRefs.current.some((r) => !r)) return
    const wRect = wrap.getBoundingClientRect()
    const cy = (el: HTMLDivElement) => {
      const r = el.getBoundingClientRect()
      return (r.top + r.bottom) / 2 - wRect.top
    }
    const re = (el: HTMLDivElement) => el.getBoundingClientRect().right - wRect.left
    const le = (el: HTMLDivElement) => el.getBoundingClientRect().left - wRect.left
    const [el1, el2, el3, el4, el5] = cardRefs.current as HTMLDivElement[]
    const spineX = (re(el1) + le(el2)) / 2
    setSnakeCoords({
      spineX,
      wrapWidth: wRect.width,
      totalH: cy(el5) + el5.getBoundingClientRect().height / 2 + 16,
      points: [
        {y: cy(el1), cardEdgeX: re(el1), dir: 'left'},
        {y: cy(el2), cardEdgeX: le(el2), dir: 'right'},
        {y: cy(el3), cardEdgeX: re(el3), dir: 'left'},
        {y: cy(el4), cardEdgeX: le(el4), dir: 'right'},
        {y: cy(el5), cardEdgeX: re(el5), dir: 'left'},
      ],
    })
  }, [])

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    const runMeasure = () => requestAnimationFrame(() => measure())
    runMeasure()

    const ro = new ResizeObserver(runMeasure)
    ro.observe(wrap)
    window.addEventListener('resize', runMeasure)

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', runMeasure)
    }
  }, [measure, resolvedSteps])

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
          obs.disconnect()
        }
      },
      {threshold: 0.1},
    )
    obs.observe(wrap)
    return () => obs.disconnect()
  }, [])

  return (
    <section className="section section-alt" id="apres-appel">
      <div className="section-inner section-inner--process">
        <header className="process-header reveal" data-reveal>
          <p className="process-eyebrow">{textOrDefault(eyebrow, DEFAULT_EYEBROW)}</p>
          <h2>
            <SectionTitle value={title} fallback={DEFAULT_TITLE} />
          </h2>
          <p className="process-sub">
            <RichText value={intro} fallback={DEFAULT_INTRO} as="inline" />
          </p>
        </header>

        <div
          ref={wrapRef}
          className={`process-snake-wrap${isVisible ? ' is-visible' : ''}`}
          style={snakeCoords ? {height: snakeCoords.totalH} : undefined}
        >
          {[resolvedSteps[0], resolvedSteps[2], resolvedSteps[4]].map((step, i) => {
            const stepNum = [1, 3, 5][i]
            const isLast = i === 2
            return (
              <div
                key={stepNum}
                ref={(el) => {
                  cardRefs.current[stepNum === 1 ? 0 : stepNum === 3 ? 2 : 4] = el
                }}
                className={`process-card process-card--left process-card--${stepNum}${isLast ? ' process-card--dest' : ''} process-card--reveal`}
                data-process-step={stepNum}
              >
                <span className="process-card-num" aria-hidden="true">
                  0{stepNum}
                </span>
                <h3 className="process-card-title">{step?.title}</h3>
                <RichText value={step?.description} className="process-card-desc" />
              </div>
            )
          })}

          {[resolvedSteps[1], resolvedSteps[3]].map((step, i) => {
            const stepNum = [2, 4][i]
            return (
              <div
                key={stepNum}
                ref={(el) => {
                  cardRefs.current[stepNum === 2 ? 1 : 3] = el
                }}
                className={`process-card process-card--right process-card--${stepNum} process-card--reveal`}
                data-process-step={stepNum}
              >
                <span className="process-card-num" aria-hidden="true">
                  0{stepNum}
                </span>
                <h3 className="process-card-title">{step?.title}</h3>
                <RichText value={step?.description} className="process-card-desc" />
              </div>
            )
          })}

          {snakeCoords && <ProcessSnakeGraphic coords={snakeCoords} isVisible={isVisible} />}
        </div>

        <div className="process-mobile">
          {resolvedSteps.map((step, i) => (
            <div
              key={i}
              className={`process-mobile-step${i === 4 ? ' process-mobile-step--dest' : ''}`}
            >
              <div className="process-mobile-dot" aria-hidden="true" />
              <div className="process-mobile-card">
                <span className="process-card-num" aria-hidden="true">
                  0{i + 1}
                </span>
                <h3 className="process-card-title">{step?.title}</h3>
                <RichText value={step?.description} className="process-card-desc" />
              </div>
            </div>
          ))}
        </div>

        <div className="process-cta reveal" data-reveal>
          <a
            className="btn btn-primary process-cta-btn"
            href={ctaUrl}
            data-cal-link={calLinkNamespace || undefined}
            data-cal-config={calLinkNamespace ? CAL_EMBED_DATA_CONFIG : undefined}
          >
            {textOrDefault(ctaLabel, DEFAULT_CTA)}
            <CtaArrow />
          </a>
        </div>
      </div>
    </section>
  )
}
