import state from '-/state'

const guiState = state.select('gui')

export const toggleConsole = () =>
  guiState.apply([ 'console', 'hidden' ], hidden => !hidden)

export const toggleHelp = () =>
  guiState.apply([ 'help', 'hidden' ], hidden => !hidden)

export default guiState
