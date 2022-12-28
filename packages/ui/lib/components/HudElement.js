import React from 'react'
import { css } from '@emotion/css'
import classnames from 'classnames'
import { colors } from './theme'

const style = css`
  background: #222222bb;
  border: 2px solid #44ee4433;
  color: ${colors.primary || 'white'};
  width: 100%;
  height: 100%;
  borderradius: 5px;

  /* Scroll Bars */
  * {
    &::-webkit-scrollbar {
      width: 0.25rem;
    }
    main::-webkit-scrollbar {
      width: 1.5vw;
      max-width: 0.75rem;
    }
    &::-webkit-scrollbar-thumb {
      background: #44ee4477;
      min-height: 33%;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-track {
      background: #444;
    }
  }
`

const HudElement = ({ className = '', children }) => {
  return <div className={classnames(className, style)}>{children}</div>
}

export default HudElement
