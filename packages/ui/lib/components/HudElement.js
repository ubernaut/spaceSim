import React from 'react'

const style = props => ({
  background: '#222222bb',
  border: '2px solid #44ee4455',
  color: '#44ff44cc',
  width: '100%',
  height: '100%',
  borderRadius: '10px'
})

const HudElement = ({ children }) => {
  return <div style={style()}>{children}</div>
}

export default HudElement
