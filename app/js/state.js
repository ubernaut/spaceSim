import Baobab from 'baobab'

const schema = {
  validate: newState => {
    return null
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
      }
    },

    scene: {
      player: {
        ship: null
      }
      players: []
    },

    controls: {
      starType: 'O5'
    }
  },
  {
    validate: (previousState, newState, affectedPaths) => {
      if (NODE_ENV === 'production') {
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
