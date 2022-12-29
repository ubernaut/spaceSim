import React from 'react'
import HudElement from './HudElement'

const style = () => ({
  fontSize: '1em',
  display: 'flex',
  alignItems: 'center',
  flexFlow: 'column',
  justifyContent: 'center',
  fontSize: '.8em',
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

export default Health
