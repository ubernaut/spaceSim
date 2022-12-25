import React from 'react'
import { createRoot } from 'react-dom/client'
import { root, branch } from 'baobab-react/higher-order'
import { debounce } from 'throttle-debounce'

import Speedometer from '@void/ui/lib/components/Speedometer'
import Messages from '@void/ui/lib/components/Messages'
import Console from '@void/ui/lib/components/Console'
import Reticle from '@void/ui/lib/components/Reticle'
import Help from '@void/ui/lib/components/Help'
import Selection from '@void/ui/lib/components/Selection'
import Health from '@void/ui/lib/components/Health'
import Shields from '@void/ui/lib/components/Shields'
import Energy from '@void/ui/lib/components/Energy'
import ShipConfig from '@void/ui/lib/components/ShipConfig'
import ShipConfigIcon from '@void/ui/lib/components/icons/ShipConfig'
import HelpIcon from '@void/ui/lib/components/icons/Help'

import { updateUser } from '-/net/api-client'
import state from '-/state'
import { handleCommand } from './command-handler'

const updateUserOptions = debounce(250, ({ username, options }) =>
  updateUser(username, options)
)

const UI = branch(
  {
    scene: ['scene'],
    player: ['scene', 'player'],
    gui: ['gui']
  },
  ({ scene, player, gui }) => {
    return (
      gui.isEnabled && (
        <div>
          <div className="selection">
            <Selection data={scene.selected && JSON.parse(scene.selected)} />
          </div>
          <div className="help">
            <Help
              isHidden={!gui.help.isOpen}
              setIsHidden={() => state.set(['gui', 'help', 'isOpen'], false)}
            />
          </div>
          <div className="reticle">
            <Reticle />
          </div>

          <Console
            className="scene-console"
            handleCommand={handleCommand}
            isHidden={!gui.console.isOpen}
          />

          <div className="scene-messages">
            <Messages messages={scene.messages} />
          </div>
          <div className="health-bar">
            <Health hp={10} maxHp={10} />
          </div>
          <div className="shields-bar">
            <Shields shields={10} maxShields={10} />
          </div>
          <div className="energy-bar">
            <Energy energy={player.ship.energy} maxEnergy={100} />
          </div>
          <div className="speedometer">
            <Speedometer speed={player.ship.movementSpeed} />
          </div>

          {gui.shipConfig.isOpen && (
            <div className="ship-config">
              <ShipConfig
                isOpen={gui.shipConfig.isOpen}
                hull="basic"
                thrustColor={player.ship.thrust.color}
                setThrustColor={color => {
                  state.set(
                    ['scene', 'player', 'ship', 'thrust', 'color'],
                    color
                  )
                  if (player.username) {
                    updateUserOptions({
                      username: player.username,
                      options: { ship: { thrust: { color } } }
                    })
                  }
                }}
                hullColor={player.ship.hull.color}
                setHullColor={color => {
                  state.set(['scene', 'player', 'ship', 'hull', 'color'], color)
                  if (player.username) {
                    updateUserOptions({
                      username: player.username,
                      options: { ship: { hull: { color } } }
                    })
                  }
                }}
                displayName={player.displayName}
                setDisplayName={displayName => {
                  state.set(['scene', 'player', 'displayName'], displayName)
                  if (player.username) {
                    updateUserOptions({
                      username: player.username,
                      options: { displayName }
                    })
                  }
                }}
                close={() => state.set(['gui', 'shipConfig', 'isOpen'], false)}
              />
            </div>
          )}

          <div className="ship-config-button">
            <a
              href="#"
              onClick={() => state.set(['gui', 'shipConfig', 'isOpen'], true)}
            >
              <ShipConfigIcon />
            </a>
          </div>

          {!gui.help.isOpen && (
            <div className="help-button">
              <a
                href="#"
                onClick={() => state.set(['gui', 'help', 'isOpen'], true)}
              >
                <HelpIcon />
              </a>
            </div>
          )}
        </div>
      )
    )
  }
)

const RootedUI = root(state, UI)

/**
 * Create a basic set of configurable options in a dat.gui element
 */
const createBasicUI = () => {
  createFpsWidget()
  const container = document.getElementById('ui')
  const root = createRoot(container)
  root.render(<RootedUI />)
}

/**
 * Adds a simple FPS widget to the document
 */
const createFpsWidget = () => {
  window.location =
    "javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();const element = stats.dom; element.className='fps-stats'; document.querySelector('#ui').appendChild(element);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';document.head.appendChild(script);})()"
}

export { createBasicUI, createFpsWidget }
