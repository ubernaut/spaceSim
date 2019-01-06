import React from 'react'
import ReactDOM from 'react-dom'
import { compose, withState } from 'recompose'

import Speedometer from 'components/Speedometer'

const App = ({ speed, setSpeed }) => {
  return (
    <div>
      <h2>Speedometer</h2>
      <Speedometer speed={speed} />
      <br />
      <input
        type="range"
        id="weight"
        min="10"
        defaultValue={speed}
        max="2000"
        step="100"
        onChange={event => setSpeed(event.target.value)}
      />
    </div>
  )
}

const enhance = compose(withState('speed', 'setSpeed', 0))

const EnhancedApp = enhance(App)

ReactDOM.render(<EnhancedApp />, document.getElementById('root'))
