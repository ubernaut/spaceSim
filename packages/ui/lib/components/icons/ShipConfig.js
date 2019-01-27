import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpaceShuttle } from '@fortawesome/free-solid-svg-icons'
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
      <FontAwesomeIcon icon={faSpaceShuttle} />
    </div>
  </HudElement>
)

export default ShipConfig
