import { struct } from 'superstruct'

const Ship = struct({
  uuid: 'string?',
  hull: {
    type: 'string',
    color: 'string'
  },
  thrust: {
    type: 'string',
    color: 'string'
  },
  movementSpeed: 'number'
})

const Player = struct({
  isLoggedIn: 'boolean',
  isLocalPlayer: 'boolean',
  userId: 'string',
  username: 'string?',
  displayName: 'string',
  ship: Ship
})

const GUI = struct({
  isEnabled: 'boolean',
  console: {
    isOpen: 'boolean'
  },
  help: {
    isOpen: 'boolean'
  },
  shipConfig: {
    isOpen: 'boolean'
  }
})

const Schema = struct({
  config: {
    server: {
      host: 'string',
      port: 'number'
    },
    threejs: {
      assetPath: 'string'
    },
    logging: {
      name: 'string',
      level: 'string'
    }
  },
  scene: {
    player: Player,
    players: [ Player ],
    bodyCount: 'number',
    messages: [ 'string' ],
    selected: 'string?'
  },
  gui: GUI
})

export default Schema
