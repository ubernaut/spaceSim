import React from 'react'
import HudElement from './HudElement'
import { compose, withState } from 'recompose'

const style = props => ({
  padding: '1em'
})

const HelpContents = () => (
  <div>
    <h3>General Info:</h3>
    <p>
      This is a nbody Gravity simulation using GPU.js and THREE.js. The physics
      is being computed on the GPU and there is still a lot of room for
      improvment.
    </p>

    <h3>Controls:</h3>
    <ul>
      <li>WASD (as is tradition)</li>
      <li>Q,E to adjust roll</li>
      <li>UP,DOWN to adjust pitch</li>
      <li>LEFT,RIGHT to adjust yaw</li>
      <li>click and drag the mouse to rotate your view</li>
      <li>scroll to zoom in and out</li>
    </ul>
    <p>
      You can zoom out very far with the logarithmic Depth Buffer. Your ship is
      20 meters across & the planets and star are to scale if you zoom way out
      you will see a number of large spheres.
    </p>
    <p>
      The Gray sphere is the size of our solar system (oort cloud) Past that
      you'll see the stars moving they're spread out around an area roughly
      equal the to milky way. The white sphere is the size of the milky way.
    </p>
    <p>The red sphere is the size of the observable universe.</p>
    <p>This is multiplayer and you may see other ships.</p>

    <h3>Commands</h3>
    <ul>
      <li>/help - Display this help screen</li>
      <li>/whoami - Returns your UUID</li>
      <li>/players - Returns the list of players</li>
      <li>/bodies - Displays the # of sim bodies</li>
      <li>/clear - Clears the console</li>
    </ul>
  </div>
)

const Help = ({ isHidden, setIsHidden }) => {
  return (
    !isHidden && (
      <HudElement>
        <div style={style()}>
          <div id="help">
            <h3 onClick={() => setIsHidden(true)}>Help (click here to hide)</h3>
            <HelpContents />
          </div>
        </div>
      </HudElement>
    )
  )
}

export default Help
