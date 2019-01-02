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
  scene: 'object',
  controls: 'object',
  urlParameters: {
    bodyCount: 'number',
    stars: 'boolean'
  }
})

const state = new Baobab(
  {
    config: {
      server: {
        host: 'https://void-server-0.herokuapp.com/',
        port: 80
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
        ship: null
      },
      players: []
    },
    controls: {
      starType: 'O5'
    },
    urlParameters: {
      bodyCount: 512,
      stars: true
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
