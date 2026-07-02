import {buildLegacyTheme} from 'sanity'

/**
 * Studio palette — matches site tokens:
 * - Frame (sidebar/nav): --beige-deep
 * - Edit surface: --surface-card (bright warm white)
 * - Plum accents unchanged
 */
export const elianeStudioTheme = buildLegacyTheme({
  '--black': '#1a1410',
  '--white': '#ffffff',
  '--gray': '#5a5048',
  '--gray-base': '#5a5048',
  '--component-bg': '#fdfbf7',
  '--component-text-color': '#1a1410',
  '--brand-primary': '#552772',
  '--default-button-color': '#5a5048',
  '--default-button-primary-color': '#552772',
  '--default-button-success-color': '#3d6b4f',
  '--default-button-warning-color': '#9a7b2e',
  '--default-button-danger-color': '#a33d3d',
  '--focus-color': '#552772',
  '--main-navigation-color': '#e9e0d2',
  '--main-navigation-color--inverted': '#1a1410',
  '--state-info-color': '#552772',
  '--state-success-color': '#3d6b4f',
  '--state-warning-color': '#9a7b2e',
  '--state-danger-color': '#a33d3d',
})
