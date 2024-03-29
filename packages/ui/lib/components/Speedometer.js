import React from 'react'
import PropTypes from 'prop-types'

import HudElement from './HudElement'

const style = ({ speed }) => ({
  fontSize: '.8em',
  display: 'flex',
  alignItems: 'center',
  flexFlow: 'column',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  color: speed >= 0 ? 'inherit' : '#ee4444cc',
})

const Speedometer = ({ speed }) => {
  speed = parseFloat(speed)

  let displaySpeed = speed
  let units = 'm/s'
  if (Math.abs(displaySpeed) > 1000) {
    displaySpeed /= 1000
    units = 'km/s'
  }

  const c = 299792458
  const percentC = speed / c

  return (
    <HudElement>
      <div style={style({ speed })}>
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

Speedometer.propTypes = {
  speed: PropTypes.number,
}

export default Speedometer
