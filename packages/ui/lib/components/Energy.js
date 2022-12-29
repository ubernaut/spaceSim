import React from 'react'
import PropTypes from 'prop-types'

import HudElement from './HudElement'

const style = () => ({
  fontSize: '.8em',
  display: 'flex',
  alignItems: 'center',
  flexFlow: 'column',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  padding: '0 1em',
})

const Energy = ({ energy, maxEnergy }) => {
  return (
    <HudElement>
      <div style={style()}>
        <label style={{ marginBottom: '.25em', fontWeight: 'bold' }}>
          Energy
        </label>
        <span style={{ width: '100%', height: '10px' }}>
          <span
            style={{
              width: `${(energy / maxEnergy) * 100}%`,
              height: '10px',
              background: '#bce237cc',
              display: 'block',
            }}
          />
        </span>
      </div>
    </HudElement>
  )
}

Energy.propTypes = {
  energy: PropTypes.number,
  maxEnergy: PropTypes.number,
}

export default Energy
