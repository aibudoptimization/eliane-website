'use client'

import type {CSSProperties} from 'react'

export type SnakePoint = {y: number; cardEdgeX: number; dir: 'left' | 'right'}
export type SnakeCoords = {spineX: number; totalH: number; wrapWidth: number; points: SnakePoint[]}

const PLUM = '#552772'
const GOLD = '#e4c045'
const PLUM4 = 'rgba(85,39,114,0.4)'

const SPINE_DELAY = 100
const BRANCH_DELAYS = [300, 700, 1100, 1500, 1900]

export function ProcessSnakeGraphic({
  coords,
  isVisible,
}: {
  coords: SnakeCoords
  isVisible: boolean
}) {
  const {spineX, totalH, wrapWidth, points} = coords
  const spineLen = Math.abs(points[4].y - points[0].y)

  return (
    <svg
      className="process-snake-svg"
      aria-hidden="true"
      viewBox={`0 0 ${Math.round(wrapWidth)} ${Math.round(totalH)}`}
      preserveAspectRatio="none"
    >
      <line
        x1={spineX}
        y1={points[0].y}
        x2={spineX}
        y2={points[4].y}
        stroke={PLUM}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.45}
        className={`process-draw-path process-draw-path--spine${isVisible ? ' is-drawn' : ''}`}
        style={
          {
            '--path-length': spineLen,
            transitionDelay: `${SPINE_DELAY}ms`,
            transitionDuration: '1.4s',
          } as CSSProperties
        }
      />

      {points.map((pt, i) => {
        const branchLen = Math.abs(pt.cardEdgeX - spineX)
        const tip = pt.cardEdgeX
        const base = pt.dir === 'left' ? tip + 11 : tip - 11
        const delay = `${BRANCH_DELAYS[i]}ms`
        const arrowPts = `${tip},${pt.y} ${base},${pt.y - 6} ${base},${pt.y + 6}`

        return (
          <g key={i}>
            <line
              x1={spineX}
              y1={pt.y}
              x2={tip}
              y2={pt.y}
              stroke={PLUM}
              strokeWidth={1.8}
              strokeLinecap="round"
              opacity={0.5}
              className={`process-draw-path process-draw-path--branch${isVisible ? ' is-drawn' : ''}`}
              style={
                {
                  '--path-length': branchLen,
                  transitionDelay: delay,
                  transitionDuration: '0.3s',
                } as CSSProperties
              }
            />

            <polygon
              points={arrowPts}
              fill={PLUM}
              opacity={0.55}
              className={`process-snake-arrow${isVisible ? ' is-visible' : ''}`}
              style={{transitionDelay: `${BRANCH_DELAYS[i] + 320}ms`}}
            />

            <circle
              cx={spineX}
              cy={pt.y}
              r={6.5}
              fill={GOLD}
              className={`process-snake-dot${isVisible ? ' is-visible' : ''}`}
              style={{transitionDelay: `${BRANCH_DELAYS[i] + 250}ms`}}
            />

            <circle
              cx={tip}
              cy={pt.y}
              r={3.5}
              fill={PLUM4}
              className={`process-snake-dot${isVisible ? ' is-visible' : ''}`}
              style={{transitionDelay: `${BRANCH_DELAYS[i] + 260}ms`}}
            />
          </g>
        )
      })}
    </svg>
  )
}
