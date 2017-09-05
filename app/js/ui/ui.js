import dat from 'app/lib/dat.gui.js'
import { starTypes } from '-/bodies/star'

const createBasicUI = guiValues => {
  const gui = new dat.gui.GUI()

  const starFolder = gui.addFolder('Star Options')
  const starType = starFolder.add(guiValues, 'starType')
    .options([ 'A1', 'A2' ])
    .name('Star Type')

  // starType.onChange(value => {})
  starFolder.open()
}

export {
  createBasicUI
}
