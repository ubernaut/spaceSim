import dat from 'app/lib/dat.gui.js'
import { starTypes } from '-/bodies/star'

const createBasicUI = (guiValues, updateColor) => {
  const gui = new dat.gui.GUI()

  const starFolder = gui.addFolder('Star Options')
  const starType = starFolder.add(guiValues, 'starType')
    .options(starTypes)
    .name('Star Type')

  starType.onChange(value => {
    updateColor(value)
  })

  starFolder.open()
}

export {
  createBasicUI
}
