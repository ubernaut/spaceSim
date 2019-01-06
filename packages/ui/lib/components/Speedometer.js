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
  height: '100%'
})

const Speedometer = ({ speed }) => {
  speed = parseFloat(speed)

  let displaySpeed = speed
  let units = 'm/s'
  if (displaySpeed > 1000) {
    displaySpeed /= 1000
    units = 'km/s'
  }

  const c = 299792458
  const percentC = speed / c

  return (
    <HudElement className="speedometer">
      <div style={style()}>
        <label style={{ marginBottom: '.25em', fontWeight: 'bold' }}>
          Speed
        </label>
        <span>
          {displaySpeed.toFixed(2)} {units} ({percentC.toFixed(4)}c)
        </span>
      </div>
    </HudElement>
  )
}

export default Speedometer
