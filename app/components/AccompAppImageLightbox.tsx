'use client'

import Image from 'next/image'
import {useCallback, useEffect, useId, useState} from 'react'
import {createPortal} from 'react-dom'

type AccompAppImageLightboxProps = {
  src: string
  lightboxSrc?: string
  alt: string
}

export function AccompAppImageLightbox({src, lightboxSrc, alt}: AccompAppImageLightboxProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const titleId = useId()
  const expandedSrc = lightboxSrc ?? src

  useEffect(() => {
    setMounted(true)
  }, [])

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [close, open])

  return (
    <>
      <button
        type="button"
        className="accomp-app-img accomp-app-img--expandable"
        onClick={() => setOpen(true)}
        aria-label={`Agrandir l'image : ${alt}`}
      >
        <Image
          className="accomp-app-img-media"
          src={src}
          alt={alt}
          width={1200}
          height={800}
          sizes="(max-width: 900px) 100vw, 50vw"
          loading="lazy"
          draggable={false}
        />
        <span className="accomp-app-img-expand" aria-hidden="true">
          <ExpandIcon />
        </span>
      </button>

      {mounted && open
        ? createPortal(
            <div
              className="accomp-lightbox"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              onClick={close}
            >
              <div className="accomp-lightbox-inner" onClick={(event) => event.stopPropagation()}>
                <button
                  type="button"
                  className="accomp-lightbox-close"
                  onClick={close}
                  aria-label="Fermer l'image agrandie"
                >
                  <CloseIcon />
                </button>
                <p id={titleId} className="sr-only">
                  {alt}
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="accomp-lightbox-img" src={expandedSrc} alt={alt} />
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
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
