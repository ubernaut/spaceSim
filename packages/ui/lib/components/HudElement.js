import React from 'react'

const style = props => ({
  background: '#222222bb',
  border: '2px solid #44ee4433',
  color: '#44ff44cc',
  width: '100%',
  height: '100%',
  borderRadius: '5px'
})

const HudElement = ({ className = '', children }) => {
  return (
    <div className={className} style={style()}>
      {children}
    </div>
  )
}

export default HudElement
