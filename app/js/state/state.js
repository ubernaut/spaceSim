import Baobab from 'baobab'
import Schema from './schema'

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

export default state
