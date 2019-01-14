import React from 'react'
import ReactDOM from 'react-dom'
import { hot } from 'react-hot-loader/root'
import { root, branch } from 'baobab-react/higher-order'
import dat from 'app/lib/dat.gui.js'
import { debounce, throttle } from 'throttle-debounce'

import Speedometer from '@void/ui/lib/components/Speedometer'
import BodyCounter from '@void/ui/lib/components/BodyCounter'
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

import { starTypes } from '-/bodies/star'
import { getUser, createUser, updateUser } from '-/net/api-client'
import state from '-/state'
import sceneState from '-/state/branches/scene'
import uniforms from '-/uniforms'

const guiState = state.get('gui')

const handleCommand = ({ command, clear }) => {
  const [cmd, ...args] = command.split(' ')
  const handlers = {
    '/help': cmd => state.set(['gui', 'help', 'hidden'], false),
    '/whoami': cmd => `Your UUID is ${state.get(['scene', 'player', 'id'])}`,
    '/players': cmd => {
      const players = state.get(['scene', 'players']).map(p => p.playerId)
      if (!players || players.length === 0) {
        return "You're the only player"
      }
      return players
    },
    '/bodies': cmd =>
      `There area ${state.get(['scene', 'bodyCount'])} sim bodies`,
    '/clear': cmd => clear(),
    '/ship': cmd => {
      const [_, ...args] = cmd.split(' ')
      console.log(args)
      for (const arg of args) {
        const [key, val] = arg.split('=')
        if (!key || !val) {
          return 'invalid arguments format'
        }
        if (key === 'thrust') {
          sceneState.set(
            ['player', 'ship', 'thrust', 'color'],
            parseInt(val, 16)
          )
          return `set ship thrust color to ${val}`
        }
        return 'unknown key'
      }
    },
    '/speed': cmd => {
      const [_, speed] = cmd.split(' ')
      sceneState.set(['player', 'movementSpeed'], parseFloat(speed, 10))
      return `set speed to ${speed}`
    },
    '/shipconfig': cmd => state.set(['gui', 'shipConfig', 'isOpen'], true),
    '/login': async cmd => {
      const [_, username, ...rest] = cmd.split(' ')
      const userData = await getUser(username)
      if (userData && userData.payload) {
        sceneState.set(
          ['player', 'ship', 'thrust', 'color'],
          userData.payload.options.ship.thrust.color
        )
        sceneState.set(['player', 'isLoggedIn'], true)
        sceneState.set(['player', 'username'], userData.payload.username)
        return `Logged in as ${username}`
      } else {
        return `Unknown user ${username}`
      }
    },
    '/newuser': async cmd => {
      const [_, username, ...rest] = cmd.split(' ')
      const userData = await getUser(username)
      if (userData && userData.payload) {
        return `User ${username} already exists`
      } else {
        const result = await createUser(username)
        console.log(result)
      }
    }
  }
  const handler = handlers[cmd] || (() => `command not found: ${cmd}`)

  return handler(command)
}

const updateUserOptions = debounce(250, ({ username, options }) =>
  updateUser(username, options)
)

const UI = branch(
  {
    guiEnabled: ['gui', 'enabled'],
    player: ['scene', 'player'],
    bodyCount: ['scene', 'bodyCount'],
    messages: ['scene', 'messages'],
    selected: ['scene', 'selected'],
    consoleIsOpen: ['gui', 'console', 'isOpen'],
    helpIsOpen: ['gui', 'help', 'isOpen'],
    shipConfigIsOpen: ['gui', 'shipConfig', 'isOpen']
  },
  ({
    guiEnabled,
    player,
    bodyCount,
    messages,
    selected,
    consoleIsOpen,
    helpIsOpen,
    shipConfigIsOpen
  }) => {
    // createFpsWidget()
    return (
      guiEnabled && (
        <div>
          <div className="selection">
            <Selection data={selected} />
          </div>
          <div className="help">
            <Help
              isHidden={!helpIsOpen}
              setIsHidden={() => state.set(['gui', 'help', 'isOpen'], false)}
            />
          </div>
          <div className="reticle">
            <Reticle />
          </div>

          <Console
            className="scene-console"
            messages={messages}
            handleCommand={handleCommand}
            isHidden={!consoleIsOpen}
          />

          <div className="scene-messages">
            <Messages messages={messages} />
          </div>
          <div className="body-counter">
            <BodyCounter bodies={bodyCount} />
          </div>
          <div className="health-bar">
            <Health hp={10} maxHp={10} />
          </div>
          <div className="shields-bar">
            <Shields shields={10} maxShields={10} />
          </div>
          <div className="energy-bar">
            <Energy energy={10} maxEnergy={10} />
          </div>
          <div className="speedometer">
            <Speedometer speed={player.movementSpeed} />
          </div>

          {shipConfigIsOpen && (
            <div className="ship-config">
              <ShipConfig
                isOpen={shipConfigIsOpen}
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

          {!helpIsOpen && (
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
const HotRootedUI = hot(RootedUI)

/**
 * Create a basic set of configurable options in a dat.gui element
 */
const createBasicUI = () => {
  ReactDOM.render(<HotRootedUI />, document.getElementById('ui'))
}

/**
 * Adds a simple FPS widget to the document
 */
const createFpsWidget = () => {
  window.location =
    "javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();const element = stats.dom; element.className='fps-stats'; document.querySelector('#ui').appendChild(element);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';document.head.appendChild(script);})()"
}

export { createBasicUI, createFpsWidget }
