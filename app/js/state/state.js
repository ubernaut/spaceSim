import Baobab from 'baobab'
import Schema from './schema'

const state = new Baobab(
  {
    config: {
      server: {
        host: process.env.API_HOST || 'http://192.168.0.112',
        port: process.env.API_PORT || 1137
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
        username: undefined,
        id: '',
        movementSpeed: 0,
        ship: {
          hull: {
            type: 'basic',
            color: '#ffffff'
          },
          thrust: {
            velocityRandomness: 0.2,
            color: '#0055ff',
            turbulence: 0.1,
            lifetime: 20,
            size: 1,
            sizeRandomness: 0.5
          }
        }
      },
      players: [],
      bodyCount: 0,
      messages: [],
      selected: ''
    },
    gui: {
      enabled: true,
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
