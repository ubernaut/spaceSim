import Baobab from 'baobab'
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
  urlParameters: {
    bodyCount: 'number',
    stars: 'boolean'
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

const state = new Baobab(
  {
    config: {
      server: {
        // host: 'http://thedagda.co/',
        // host: 'https://void-server-0.herokuapp.com/',
        host: 'localhost',
        port: 1137
      },
      threejs: {
        assetPath: 'app/assets/models/'
      },
      logging: {
        name: 'void',
        level: 'debug'
      }
    },
    scene: {
      player: {
        id: '',
        movementSpeed: 0
      },
      players: [],
      bodyCount: 0,
      messages: [],
      selected: ''
    },
    urlParameters: {
      bodyCount: 1,
      stars: true
    },
    gui: {
      enabled: true,
      console: {
        hidden: false
      },
      help: {
        hidden: true
      }
    }
  },
  {
    validate: (previousState, newState, affectedPaths) => {
      if (process.env.NODE_ENV === 'production') {
        return
      }
      try {
        Schema(newState)
      } catch (err) {
        console.error(err)
      }
    }
  }
)

export const addMessage = msg => {
  state.set([ 'scene', 'messages' ], [ ...state.get([ 'scene', 'messages' ]), msg ])
  return msg
}

export const setSelected = data => {
  state.set([ 'scene', 'selected' ], data ? JSON.stringify(data, null, 2) : '')
}

export default state
