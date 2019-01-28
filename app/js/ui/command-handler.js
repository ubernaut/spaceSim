import { getUser, createUser, updateUser } from '-/net/api-client'
import sceneState from '-/state/branches/scene'
import guiState, { toggleHelp } from '-/state/branches/gui'

export const handleCommand = ({ command, clear }) => {
  const [ cmd, ...args ] = command.split(' ')
  const handlers = {
    '/help': toggleHelp,

    '/whoami': cmd => `Your UUID is ${sceneState.get([ 'player', 'id' ])}`,

    '/players': cmd => {
      const players = sceneState.get('players').map(p => p.playerId)
      if (!players || players.length === 0) {
        return "You're the only player"
      }
      return `${players.length} other ${
        players.length === 1 ? 'player' : 'players'
      } online`
    },

    '/bodies': cmd => `There area ${sceneState.get('bodyCount')} sim bodies`,

    '/clear': cmd => clear(),

    '/ship': cmd => {
      const [ _, ...args ] = cmd.split(' ')
      for (const arg of args) {
        const [ key, val ] = arg.split('=')
        if (!key || !val) {
          return 'invalid arguments format'
        }
        if (key === 'thrust') {
          sceneState.set(
            [ 'player', 'ship', 'thrust', 'color' ],
            parseInt(val, 16)
          )
          return `set ship thrust color to ${val}`
        }
        return 'unknown key'
      }
    },

    '/speed': cmd => {
      const [ _, speed ] = cmd.split(' ')
      sceneState.set([ 'player', 'ship', 'movementSpeed' ], parseFloat(speed, 10))
      return `set speed to ${speed}`
    },

    '/shipconfig': cmd => guiState.set([ 'shipConfig', 'isOpen' ], true),

    '/login': async cmd => {
      const [ _, username, ...rest ] = cmd.split(' ')
      const userData = await getUser(username)
      if (userData && userData.payload) {
        sceneState.set(
          [ 'player', 'ship', 'thrust', 'color' ],
          userData.payload.options.ship.thrust.color
        )
        sceneState.set(
          [ 'player', 'ship', 'hull', 'color' ],
          userData.payload.options.ship.hull.color
        )
        sceneState.set([ 'player', 'isLoggedIn' ], true)
        sceneState.set([ 'player', 'username' ], userData.payload.username)
        return `Logged in as ${username}`
      } else {
        return `Unknown user ${username}`
      }
    },

    '/newuser': async cmd => {
      const [ _, username, ...rest ] = cmd.split(' ')
      const userData = await getUser(username)
      if (userData && userData.payload) {
        return `User ${username} already exists`
      } else {
        const result = await createUser(username)
      }
    }
  }
  const handler = handlers[cmd] || (() => `command not found: ${cmd}`)

  return handler(command)
}
