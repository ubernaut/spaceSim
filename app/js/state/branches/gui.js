import state from '-/state'

const guiState = state.select('gui')

export const toggleConsole = () =>
  guiState.apply([ 'console', 'isOpen' ], isOpen => !isOpen)

export const toggleHelp = () =>
  guiState.apply([ 'help', 'isOpen' ], isOpen => !isOpen)

export default guiState
