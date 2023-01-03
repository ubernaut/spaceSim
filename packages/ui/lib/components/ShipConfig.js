import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWindowClose } from '@fortawesome/free-solid-svg-icons'

import PropTypes from 'prop-types'
import HudElement from './HudElement'

const style = (props) => ({
  fontSize: '1em',
  display: 'flex',
  alignItems: 'start',
  flexFlow: 'column',
  justifyContent: 'flex-start',
  width: '100%',
  height: '100%',
  overflowY: 'auto',
  padding: '1em',
})

const formStyle = {
  width: '100%',
}

const inputStyle = {
  height: '2em',
  background: '#333333aa',
  color: 'inherit',
  border: 'inherit',
  width: '100%',
  marginTop: '0.5em',
  marginBottom: '1.5em',
}

const ShipConfig = ({
  close,
  displayName,
  hullColor,
  isOpen,
  setDisplayName,
  setHullColor,
  setThrustColor,
  thrustColor,
}) => {
  return (
    isOpen && (
      <HudElement>
        <a
          style={{
            cursor: 'pointer',
            position: 'absolute',
            top: '15px',
            right: '15px',
            textDecoration: 'none',
            color: 'inherit',
            fontSize: '1.5em',
          }}
          onClick={() => close()}
        >
          <FontAwesomeIcon icon={faWindowClose} />
        </a>
        <div style={style()}>
          <label style={{ fontWeight: 'bold' }}>Ship Config</label>
          <br />
          <form style={formStyle}>
            <label>Display Name</label>
            <input
              style={inputStyle}
              defaultValue={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
            />

            <label>Hull Type</label>
            <select style={inputStyle}>
              <option>Basic</option>
            </select>

            <label>Hull Color</label>
            <input
              style={inputStyle}
              type="color"
              defaultValue={hullColor}
              onChange={(event) => setHullColor(event.target.value)}
            />

            <label>Thrust Color</label>
            <input
              style={inputStyle}
              type="color"
              defaultValue={thrustColor}
              onChange={(event) => setThrustColor(event.target.value)}
            />
          </form>
        </div>
      </HudElement>
    )
  )
}

ShipConfig.propTypes = {
  close: PropTypes.func,
  displayName: PropTypes.string,
  hullColor: PropTypes.string,
  isOpen: PropTypes.bool,
  setDisplayName: PropTypes.func,
  setHullColor: PropTypes.func,
  setThrustColor: PropTypes.func,
  thrustColor: PropTypes.string,
}

export default ShipConfig
