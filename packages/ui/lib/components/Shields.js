import React from 'react'
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

const Shields = ({ shields, maxShields }) => {
  return (
    <HudElement>
      <div style={style()}>
        <label style={{ marginBottom: '.25em', fontWeight: 'bold' }}>
          Shields
        </label>
        <span style={{ width: '100%', height: '10px' }}>
          <span
            style={{
              width: `${(shields / maxShields) * 100}%`,
              height: '10px',
              background: '#4a65ffcc',
              display: 'block',
            }}
          />
        </span>
      </div>
    </HudElement>
  )
}

export default Shields
