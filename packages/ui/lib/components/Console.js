import React from 'react'
import { compose, withState, withHandlers } from 'recompose'
import { css } from 'emotion'
import classnames from 'classnames'
import HudElement from './HudElement'

const style = () => css`
  font-size: 1em;
  display: flex;
  align-items: start;
  flex-flow: column;
  justify-content: flex-end;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 2em;
  width: 100%;
  height: 100%;

  input {
    width: 100%;
    background: #44444477;
    border: none;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    color: #ddd;
    height: 2em;
    padding: 1em;
    outline: none;
  }
`

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
      <div className={style()}>
        <ul style={{ listStyle: 'none', paddingLeft: '1em' }}>
          {output.map((o, i) => (
            <li key={`output-${i}`}>{o}</li>
          ))}
        </ul>
        <input
          autoFocus
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
