import React from 'react'
import HudElement from './HudElement'

const speedoStyle = props => ({
  fontSize: '1em',
  display: 'flex',
  alignItems: 'center',
  flexFlow: 'column',
  justifyContent: 'center',
  fontSize: '1em',
  width: '100%',
  height: '100%'
})

const BodyCounter = ({ bodies }) => {
  return (
    <HudElement className="speedometer">
      <div style={speedoStyle()}>
        <label style={{ marginBottom: '.25em', fontWeight: 'bold' }}>
          Bodies
        </label>
        <span>{bodies}</span>
      </div>
    </HudElement>
  )
}

export default BodyCounter
