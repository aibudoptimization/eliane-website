'use client'

import type {CSSProperties} from 'react'
import type {NavbarProps} from 'sanity'

const siteLinkStyle: CSSProperties = {
  flexShrink: 0,
  marginRight: 12,
  padding: '6px 12px',
  borderRadius: 999,
  border: '1px solid rgba(85, 39, 114, 0.22)',
  background: 'rgba(255, 255, 255, 0.65)',
  color: '#552772',
  fontFamily: 'system-ui, sans-serif',
  fontSize: 12,
  fontWeight: 500,
  textDecoration: 'none',
  whiteSpace: 'nowrap',
}

export function StudioNavbar(props: NavbarProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        minWidth: 0,
      }}
    >
      <div style={{flex: 1, minWidth: 0}}>{props.renderDefault(props)}</div>
      <a href="/" target="_blank" rel="noopener noreferrer" style={siteLinkStyle}>
        Voir sur le site ↗
      </a>
    </div>
  )
}
