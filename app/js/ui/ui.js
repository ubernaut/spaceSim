import dat from 'app/lib/dat.gui.js'
import { starTypes } from '-/bodies/star'
import state from '-/state'
import uniforms from '-/uniforms'

const guiState = state.get('gui')

/**
 * Create a basic set of configurable options in a dat.gui element
 */
const createBasicUI = () => {
  if (!guiState.enabled) {
    return
  }
  createFpsWidget()

  const gui = new dat.gui.GUI()

  const starOptions = guiState.options.star
  if (starOptions.enabled) {
    initStarOptions(gui, starOptions)
  }

  const shipOptions = guiState.options.ship
  if (shipOptions.enabled) {
    initShipOptions(gui, shipOptions)
  }
}

/**
 * Ship options
 */
const initShipOptions = (gui, options) => {
  const shipFolder = gui.addFolder(options.label)
  const ship = {
    type: 'aship'
  }
  shipFolder
    .add(ship, 'type')
    .options([])
    .name('Type')
    .listen()
  shipFolder.open()
}

/**
 * Star options
 */
const initStarOptions = (gui, options) => {
  const starFolder = gui.addFolder(options.label)
  const star = {
    type: options.options.type,
    size: options.options.size
  }
  starFolder
    .add(star, 'type')
    .options(starTypes)
    .name('Type')
    .onChange(value => {
      const [ r, g, b ] = value.split(',').map(parseFloat)
      uniforms.sun.color.red.value = (r / 255) * 0.75
      uniforms.sun.color.green.value = (g / 255) * 0.75
      uniforms.sun.color.blue.value = (b / 255) * 0.75
    })
    .listen()
  starFolder
    .add(star, 'size', 0, 200, 5)
    .name('Size')
    .listen()
  starFolder.open()
}

/**
 * Adds a simple FPS widget to the document
 */
const createFpsWidget = () => {
  window.location =
    "javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';document.head.appendChild(script);})()"
}

export { createBasicUI, createFpsWidget }
