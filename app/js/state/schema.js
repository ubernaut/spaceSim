import { struct } from 'superstruct'

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
    player: {
      id: 'string',
      ship: 'object?',
      movementSpeed: 'number'
    },
    players: [ 'object' ],
    bodyCount: 'number',
    messages: [ 'string' ],
    selected: 'string?'
  },
  gui: {
    enabled: 'boolean',
    console: {
      hidden: 'boolean'
    },
    help: {
      hidden: 'boolean'
    }
  }
})

export default Schema