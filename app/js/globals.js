/**
 * This files holds non-serializable global state, such as functions,
 * complex objects, object instances, etc.
 *
 * Put serializable state into the app's state tree in state/state.js.
 */

const uniforms = {
  sun: {
    color: {
      red: {
        value: 1
      },
      green: {
        value: 1
      },
      blue: {
        value: 0.5
      }
    }
  }
}

export default uniforms
