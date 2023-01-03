import React from 'react'
import { css } from '@emotion/css'
import PropTypes from 'prop-types'

import HudElement from './HudElement'

const style = css`
  font-size: 0.8em;
  display: flex;
  align-items: start;
  flex-flow: column;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 1em;
`

const Messages = ({ messages }) => {
  return (
    <HudElement>
      <div className={style}>
        <label style={{ fontWeight: 'bold' }}>System Messages</label>
        <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
          {messages.map((m, i) => (
            <li key={`message-${i}`}>{m}</li>
          ))}
        </ul>
      </div>
    </HudElement>
  )
}

Messages.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.string),
}

export default Messages
