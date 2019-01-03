import dat from 'app/lib/dat.gui.js'
import { starTypes } from '-/bodies/star'
import state from '-/state'

const guiState = state.get('gui')

const createBasicUI = updateColor => {
  if (!guiState.enabled) {
    return
  }

  const gui = new dat.gui.GUI()

  const starOptions = guiState.options.star
  if (starOptions.enabled) {
    initStarOptions(gui, updateColor, starOptions)
  }

  const shipOptions = guiState.options.ship
  if (shipOptions.enabled) {
    initShipOptions(gui, shipOptions)
  }
}

const initShipOptions = (gui, options) => {
  const shipFolder = gui.addFolder(options.label)
  const ship = {
    type: 'aship'
  }
  shipFolder
    .add(ship, 'type')
    .options([])
    .name('Type')
    // .onChange(value => updateColor(value))
    .listen()
  shipFolder.open()
}

const initStarOptions = (gui, updateColor, options) => {
  const starFolder = gui.addFolder(options.label)
  const star = {
    type: options.options.type,
    size: options.options.size
  }
  starFolder
    .add(star, 'type')
    .options(starTypes)
    .name('Type')
    .onChange(value => updateColor(value))
    .listen()
  starFolder
    .add(star, 'size', 0, 200, 5)
    .name('Size')
    .listen()
  starFolder.open()
}

export { createBasicUI }
