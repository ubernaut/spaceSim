import React, { useEffect, useRef } from 'react'
import { css } from '@emotion/css'
import PropTypes from 'prop-types'

import HudElement from './HudElement'
import { colors } from './theme'

const style = css`
  font-size: 0.7em;
  display: flex;
  align-items: start;
  flex-flow: column;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  > label {
    height: 2.5em;
    width: 100%;
    padding: 0.25em;
    font-weight: bold;
    margin-bottom: 0;
  }
  > ul {
    overflow-y: auto;
    list-style: none;
    padding: 0;
    width: 100%;
    > li {
      padding: 0 0.25rem;
      border-top: 1px solid ${colors.primary};
    }
  }
`

const Messages = ({ messages }) => {
  const lastRef = useRef(null)
  // Always scroll the dummy last element into view after render
  useEffect(() => lastRef.current.scrollIntoView())
  return (
    <HudElement>
      <div className={style}>
        <label>Messages</label>
        <ul>
          {messages.map((m, i) => (
            <li key={`message-${i}`}>{m}</li>
          ))}
          <li ref={lastRef}></li>
        </ul>
      </div>
    </HudElement>
  )
}

Messages.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.string),
}

export default Messages
