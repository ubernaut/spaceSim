import React from 'react'

const hudStyle = props => ({
  background: '#444444aa',
  border: '1px solid #555',
  color: 'white',
  width: '100%',
  height: '100%'
})

const HudElement = ({ children }) => {
  return <div style={hudStyle()}>{children}</div>
}

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
      <div style={speedoStyle()}>
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
