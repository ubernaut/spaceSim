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
  return (
    <HudElement className="speedometer">
      <div style={speedoStyle()}>
        <label style={{ marginBottom: '.25em', fontWeight: 'bold' }}>
          Speed
        </label>
        <span>{parseFloat(speed).toFixed(2)} m/s</span>
      </div>
    </HudElement>
  )
}

export default Speedometer
