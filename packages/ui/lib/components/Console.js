import React from 'react'
import HudElement from './HudElement'
import { compose, withState, withHandlers } from 'recompose'

const style = props => ({
  fontSize: '1em',
  display: 'flex',
  alignItems: 'start',
  flexFlow: 'column',
  justifyContent: 'flex-end',
  fontSize: '1em',
  overflowY: 'auto',
  overflowX: 'hidden',
  paddingBottom: '2em',
  width: '100%',
  height: '100%'
})

const inputStyle = props => ({
  width: '100%',
  background: '#44444477',
  border: 'none',
  borderTop: '2px solid green',
  position: 'absolute',
  bottom: '0',
  left: '0',
  right: '0',
  color: '#ddd',
  height: '2em',
  padding: '0 1em',
  borderRadius: '0 0 10px 10px',
  outline: 'none'
})

const Console = ({
  isHidden = false,
  output,
  onChange,
  onKeyPress,
  command
}) => {
  if (isHidden) {
    return false
  }
  return (
    <HudElement className="scene-console">
      <div style={style()}>
        <ul style={{ listStyle: 'none', paddingLeft: '1em' }}>
          {output.map((o, i) => (
            <li key={`output-${i}`}>{o}</li>
          ))}
        </ul>
        <input
          autoFocus
          style={inputStyle()}
          type="text"
          onChange={onChange}
          onKeyPress={onKeyPress}
          value={command}
        />
      </div>
    </HudElement>
  )
}

const enhance = compose(
  withState('command', 'setCommand', ''),
  withState('output', 'setOutput', [
    'Press ESC to toggle this console',
    'Type /help to see instructions and available commands'
  ]),
  withHandlers({
    onChange: ({ setCommand }) => event => setCommand(event.target.value),
    onKeyPress: ({
      command,
      output,
      setCommand,
      setOutput,
      handleCommand
    }) => async event => {
      if (event.key === 'Enter') {
        try {
          const result = await handleCommand({
            command,
            clear: () => setOutput([])
          })
          if (result) {
            setOutput([...output, result])
          }
          setCommand('')
        } catch (err) {
          console.error(err)
        }
      }
    }
  })
)

export default enhance(Console)
