import React from 'react'
import HudElement from './HudElement'

const style = props => ({
  fontSize: '1em',
  display: 'flex',
  alignItems: 'center',
  flexFlow: 'column',
  justifyContent: 'center',
  fontSize: '1em',
  width: '100%',
  height: '100%',
  minWidth: '100px',
  minHeight: '100px',
  borderRadius: '100px',
  border: '1px dashed #44ee4455'
})

const BodyCounter = ({ bodies }) => {
  return <div style={style()} />
}

export default BodyCounter
