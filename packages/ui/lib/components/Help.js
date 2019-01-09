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
    <p>
      To change the number of bodies in the simulation, change the "bodyCount"
      url parameter thusly:
    </p>
    <p>
      <a className="brightText" href="http://thedagda.co:9000?bodyCount=1000">
        http://thedagda.co:9000?bodyCount=1000
      </a>
    </p>
    <p>you can also disable stars by setting "nostars=true":</p>
    <p>
      <a
        className="brightText"
        href="http://thedagda.co:9000?bodyCount=100&stars=false"
      >
        http://thedagda.co:9000?bodyCount=100&stars=false
      </a>
    </p>

    <h3>Controls:</h3>
    <ul style={{ listStyle: 'none' }}>
      <li>wasd (as is tradition)</li>
      <li>q,e to roll</li>
      <li>r,f for up and down</li>
      <li>Click and drag the mouse to rotate your view.</li>
      <li>spacebar shoots stuff (try holding it down)</li>
      <li>Mousewheel zooms</li>
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
    <p>
      This is multiplayer you may see other ships, you may shoot them with the
      colored balls
    </p>
  </div>
)

const Help = ({ isHidden, setIsHidden }) => {
  return (
    !isHidden && (
      <HudElement className="help">
        <div style={style()}>
          <div id="help">
            <h3 onClick={() => setIsHidden(true)}>Help (click to hide)</h3>
            <HelpContents />
          </div>
        </div>
      </HudElement>
    )
  )
}

export default Help
