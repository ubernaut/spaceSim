import React from 'react'
import HudElement from './HudElement'

const style = props => ({
  fontSize: '1em',
  display: 'flex',
  alignItems: 'start',
  flexFlow: 'column',
  justifyContent: 'flex-start',
  fontSize: '1em',
  width: '100%',
  height: '100%',
  overflowY: 'auto',
  padding: '1em'
})

const formStyle = {
  width: '100%'
}

const inputStyle = {
  height: '2em',
  background: '#333333aa',
  color: 'inherit',
  border: 'inherit',
  width: '100%',
  marginTop: '0.5em',
  marginBottom: '1.5em'
}

const ShipConfig = ({ isOpen, close, hull, thrustColor, setThrustColor }) => {
  return (
    isOpen && (
      <HudElement>
        <a
          href="#"
          style={{
            position: 'absolute',
            top: '1em',
            right: '1.5em',
            textDecoration: 'none',
            color: 'inherit'
          }}
          onClick={() => close()}
        >
          X
        </a>
        <div style={style()}>
          <label style={{ fontWeight: 'bold' }}>Ship Config</label>
          <br />
          <form style={formStyle}>
            <label>Hull Type</label>
            <select style={inputStyle}>
              <option>Basic</option>
            </select>

            <label>Thruster Color</label>
            <input
              style={inputStyle}
              type="color"
              defaultValue={thrustColor}
              onChange={event => setThrustColor(event.target.value)}
            />
          </form>
        </div>
      </HudElement>
    )
  )
}

export default ShipConfig
