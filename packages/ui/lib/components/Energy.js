import React from 'react'
import HudElement from './HudElement'

const style = () => ({
  fontSize: '1em',
  display: 'flex',
  alignItems: 'center',
  flexFlow: 'column',
  justifyContent: 'center',
  fontSize: '1em',
  width: '100%',
  height: '100%',
  padding: '0 1em'
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
              display: 'block'
            }}
          />
        </span>
      </div>
    </HudElement>
  )
}

export default Energy
