import React from 'react'
import { FaSpaceShuttle } from 'react-icons/fa'
import HudElement from '../HudElement'

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

const ShipConfig = () => (
  <HudElement>
    <div style={style()}>
      <FaSpaceShuttle />
    </div>
  </HudElement>
)

export default ShipConfig
