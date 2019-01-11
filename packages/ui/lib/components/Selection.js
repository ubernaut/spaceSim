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

const Selection = ({ data }) => {
  return !data || data === '' ? null : (
    <HudElement>
      <div style={style()}>
        <label style={{ fontWeight: 'bold' }}>Selected Object</label>
        <pre style={{ width: '100%', height: '100%' }}>{data}</pre>
      </div>
    </HudElement>
  )
}

export default Selection
