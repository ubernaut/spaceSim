import React from 'react'
import { css } from '@emotion/css'
import PropTypes from 'prop-types'

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

const Console = ({ isHidden = false, handleCommand }) => {
  if (isHidden) {
    return false
  }

  const [command, setCommand] = React.useState('')
  const [output, setOutput] = React.useState([
    'Press ESC to toggle this console',
    'Type /help to see instructions and available commands',
  ])

  const onChange = (event) => setCommand(event.target.value)
  const onKeyPress = async (event) => {
    if (event.key === 'Enter') {
      try {
        const result = await handleCommand({
          command,
          clear: () => setOutput([]),
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

Console.propTypes = {
  isHidden: PropTypes.bool,
  handleCommand: PropTypes.func,
}

export default Console
