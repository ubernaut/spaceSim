import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpaceShuttle } from '@fortawesome/free-solid-svg-icons'
import { css } from '@emotion/css'

import HudElement from '../HudElement'

const style = css`
  font-size: 1em;
  display: flex;
  align-items: center;
  flex-flow: column;
  justify-content: center;
  font-size: 1em;
  width: 100%;
  height: 100%;
  padding: 0;
`

const ShipConfig = () => (
  <HudElement>
    <div className={style}>
      <FontAwesomeIcon icon={faSpaceShuttle} />
    </div>
  </HudElement>
)

export default ShipConfig
