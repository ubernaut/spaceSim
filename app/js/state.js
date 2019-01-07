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
      ship: 'object?',
      movementSpeed: 'number'
    },
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
    options: 'object'
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
        movementSpeed: 0
      },
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
      options: {
        star: {
          label: 'Star Options',
          enabled: true,
          options: {
            type: '05',
            size: 100
          }
        },
        ship: {
          label: 'Ship Options',
          enabled: true,
          options: {
            type: 'aship'
          }
        }
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
