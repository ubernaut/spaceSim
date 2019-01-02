import init from './sim'

const createViewer = (rootId, animateCallbackHelpers, options) => {
  const root = document.getElementById(rootId)
  if (!root) {
    console.error('invalid root element')
  }
  return init(root, animateCallbackHelpers, options)
}

export { createViewer }
