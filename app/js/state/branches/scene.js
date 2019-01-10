import state from '-/state'

const sceneState = state.select('scene')

export const addMessage = msg => {
  sceneState.apply('messages', messages => [].concat(messages, msg))
  return msg
}

export const setSelected = data => {
  sceneState.set('selected', data ? JSON.stringify(data, null, 2) : '')
}

export default sceneState
