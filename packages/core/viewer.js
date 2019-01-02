import init from './sim'

const defaultOpts = {}

const createViewer = (
  rootId,
  animateCallbackHelpers,
  options = defaultOpts
) => {
  const root = document.getElementById(rootId)
  if (!root) {
    console.error('invalid root element')
  }
  return init(root, animateCallbackHelpers)
}

export { createViewer }
