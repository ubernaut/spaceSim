import init from './sim'

const defaultOpts = {}

const createViewer = (rootId, options = defaultOpts) => {
  const root = document.getElementById(rootId)
  if (!root) {
    console.error('invalid root element')
  }
  return init(root)
}

export { createViewer }
