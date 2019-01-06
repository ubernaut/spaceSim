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
  overflowY: 'auto'
})

const Messages = ({ messages }) => {
  return (
    <HudElement className="speedometer">
      <div style={style()}>
        <ul style={{ listStyle: 'none', paddingLeft: '1em' }}>
          {messages.map((m, i) => (
            <li key={`message-${i}`}>{m}</li>
          ))}
        </ul>
      </div>
    </HudElement>
  )
}

export default Messages
