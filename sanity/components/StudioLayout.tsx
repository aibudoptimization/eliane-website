'use client'

import type {LayoutProps} from 'sanity'
import {WelcomeSplash} from './WelcomeSplash'

export function StudioLayout(props: LayoutProps) {
  return (
    <>
      {props.renderDefault(props)}
      <WelcomeSplash />
    </>
  )
}
