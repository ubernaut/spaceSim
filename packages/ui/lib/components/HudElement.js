import React from 'react'

const style = props => ({
  background: '#33333377',
  border: '1px solid #44ee4477',
  color: '#44ff44cc',
  width: '100%',
  height: '100%'
})

const HudElement = ({ children }) => {
  return <div style={style()}>{children}</div>
}

export default HudElement
