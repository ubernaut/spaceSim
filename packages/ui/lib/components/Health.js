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

const Health = ({ hp, maxHp }) => {
  return (
    <HudElement>
      <div style={style()}>
        <label style={{ marginBottom: '.25em', fontWeight: 'bold' }}>
          Health
        </label>
        <span style={{ width: '100%', height: '10px' }}>
          <span
            style={{
              width: `${(hp / maxHp) * 100}%`,
              height: '10px',
              background: '#ee4444cc',
              display: 'block',
            }}
          />
        </span>
      </div>
    </HudElement>
  )
}

Health.propTypes = {
  hp: PropTypes.number,
  maxHp: PropTypes.number,
}

export default Health
