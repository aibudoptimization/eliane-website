'use client'

import {useCallback} from 'react'

type ProcessDrawPathProps = {
  d: string
  stroke: string
  strokeWidth: number
  timingClass: string
}

function prepareDrawPath(path: SVGPathElement) {
  const length = path.getTotalLength()
  path.style.setProperty('--path-length', String(length))
  path.dataset.ready = 'true'
}

function ProcessDrawPath({d, stroke, strokeWidth, timingClass}: ProcessDrawPathProps) {
  const pathRef = useCallback(
    (node: SVGPathElement | null) => {
      if (!node) return
      prepareDrawPath(node)
    },
    [d],
  )

  return (
    <path
      ref={pathRef}
      className={`process-draw-path ${timingClass}`}
      d={d}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      fill="none"
    />
  )
}

const ARROW_1_CURVE =
  'M2.50022 59.7389C29.29 56.3235 105.673 45.849 116.309 77.9252C120.735 91.2721 117.483 112.485 106.054 124.9C81.5101 151.56 25.7388 139.708 60.3723 105.959C79.7954 87.0312 115.232 88.667 140.27 90.1182C177.178 92.2574 199.198 109.87 220.255 132.163C230.948 143.484 264.86 206.332 259.469 205.654'

const ARROW_1_HEAD =
  'M275.748 227.064C270.251 226.201 228.561 218.426 233.43 219.949C239.804 221.942 246.693 223.422 252.647 226.095C259.692 229.258 267.766 230.793 274.259 234.622C279.957 237.982 280.584 205.766 279.141 200.383'

const ARROW_2_PATH =
  'M91.0681 1.00006C70.3063 16.0061 55.7731 23.925 30.2716 19.1435C24.0822 17.983 13.9133 16.8754 8.94501 12.4591C6.12295 9.95054 1.74946 9.71653 7.24741 7.5784C11.7751 5.81759 18.3406 2.90987 23.2689 2.90987C25.0487 2.90987 7.62202 7.55417 2.26061 8.74554C-4.59384 10.2687 18.5637 31.6269 22.314 35.3771'

const LINE_2_PATH =
  'M220.462 11.2927C175.074 8.491 130.077 3.26699 84.6065 2.10441C58.4693 1.43614 -19.6942 -0.520079 6.1778 3.25293C48.7031 9.45454 92.6536 9.25527 135.47 13.4257C152.06 15.0415 168.516 17.2075 185.021 19.4965C191.373 20.3774 196.334 21.866 186.17 21.3014C140.807 18.7812 95.6786 13.1806 50.3144 10.4723C45.4734 10.1833 31.1306 10.0424 35.7936 11.3747C52.8859 16.2582 71.2226 18.1821 88.7083 20.8912C109.764 24.1534 131.161 26.1908 152.042 30.4897C159.543 32.0339 169.588 32.5157 176.571 35.6581C188.929 41.2189 149.511 37.7988 135.962 37.545C113.414 37.1225 90.8918 35.8209 68.3629 34.9197'

const PLUM = '#552772'

export function ProcessArrow1Graphic({variant = 'arrow1'}: {variant?: 'arrow1' | 'arrow3'}) {
  const curveClass =
    variant === 'arrow3' ? 'process-draw-path--arrow3-curve' : 'process-draw-path--arrow1-curve'
  const headClass =
    variant === 'arrow3' ? 'process-draw-path--arrow3-head' : 'process-draw-path--arrow1-head'

  return (
    <svg viewBox="0 0 288 292" fill="none" aria-hidden="true">
      <ProcessDrawPath d={ARROW_1_CURVE} stroke={PLUM} strokeWidth={5} timingClass={curveClass} />
      <ProcessDrawPath d={ARROW_1_HEAD} stroke={PLUM} strokeWidth={5} timingClass={headClass} />
    </svg>
  )
}

export function ProcessArrow2Graphic() {
  return (
    <svg viewBox="0 0 93 37" fill="none" aria-hidden="true">
      <ProcessDrawPath d={ARROW_2_PATH} stroke={PLUM} strokeWidth={2} timingClass="process-draw-path--arrow2" />
    </svg>
  )
}

export function ProcessLine2Graphic() {
  return (
    <svg viewBox="0 0 222 40" fill="none" aria-hidden="true">
      <ProcessDrawPath d={LINE_2_PATH} stroke={PLUM} strokeWidth={2} timingClass="process-draw-path--line" />
    </svg>
  )
}
