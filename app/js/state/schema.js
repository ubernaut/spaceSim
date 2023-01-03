import { define, optional, string, number, object, boolean } from 'superstruct'

const Ship = define({
  uuid: optional(string()),
  hull: {
    type: string(),
    color: string(),
  },
  thrust: {
    type: string(),
    color: string(),
  },
  weapon: optional(object()),
  energy: optional(number()),
  movementSpeed: number(),
})

const Player = define({
  isLoggedIn: boolean(),
  isLocalPlayer: boolean(),
  userId: string(),
  username: optional(string()),
  displayName: string(),
  ship: Ship,
})

const GUI = define({
  isEnabled: boolean(),
  console: {
    isOpen: boolean(),
  },
  help: {
    isOpen: boolean(),
  },
  shipConfig: {
    isOpen: boolean(),
  },
})

const Schema = define({
  config: {
    server: {
      host: string(),
      port: number(),
      socketHost: string(),
    },
    threejs: {
      assetPath: string(),
    },
    logging: {
      name: string(),
      level: string(),
    },
  },
  scene: {
    player: Player,
    players: [Player],
    bodyCount: number(),
    messages: [string()],
    selected: optional(string()),
  },
  gui: GUI,
})

export default Schema
