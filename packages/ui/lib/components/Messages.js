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

const Messages = ({ messages }) => {
  return (
    <HudElement>
      <div style={style()}>
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

export default Messages
