import Baobab from 'baobab'
import Schema from './schema'
import { guid } from '-/utils'

const state = new Baobab(
  {
    config: {
      server: {
        host: process.env.API_HOST || 'https://secretworkshop.net',
        port: parseInt(process.env.API_PORT) || 443
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
        isLoggedIn: false,
        isLocalPlayer: true,
        userId: guid(),
        username: 'Anonymous',
        displayName: 'Anonymous',
        ship: {
          hull: {
            type: 'basic',
            color: '#ffffff'
          },
          thrust: {
            type: 'basic',
            color: '#0055ff'
          },
          weapon: {
            type: 'laser',
            color: '#0000ff'
          },
          energy: 100,
          movementSpeed: 0
        }
      },
      players: [],
      bodyCount: 0,
      messages: [],
      selected: ''
    },
    gui: {
      isEnabled: true,
      console: {
        isOpen: false
      },
      help: {
        isOpen: false
      },
      shipConfig: {
        isOpen: false
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

export default state
