import Baobab from 'baobab'

const schema = {
  validate: newState => {
    return { error: null }
  }
}

const state = new Baobab(
  {
    config: {
      server: {
        host: 'http://thedagda.co',
        // host: 'http://localhost',
        port: '1137'
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
    }
  },
  {
    validate: (previousState, newState, affectedPaths) => {
      if (process.env.NODE_ENV === 'production') {
        return
      }
      const { error } = schema.validate(newState)
      if (error) {
        console.error(error)
      }
    }
  }
)

export default state
