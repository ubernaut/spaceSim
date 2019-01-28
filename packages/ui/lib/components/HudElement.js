import React from 'react'
import { css } from 'emotion'
import classnames from 'classnames'
import { colors } from './theme'

const style = css`
  background: #222222bb;
  border: 2px solid #44ee4433;
  color: ${colors.primary || 'white'};
  width: 100%;
  height: 100%;
  borderradius: 5px;
`

const HudElement = ({ className = '', children }) => {
  return <div className={classnames(className, style)}>{children}</div>
}

export default HudElement
