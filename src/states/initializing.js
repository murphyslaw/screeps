'use strict'

global.Initializing = class extends global.State {
  run() {
    let result = OK
    let context = {}

    // check prerequisites
    if (false) {}

    // execute action
    if (OK === result) {
      const action = new Initialize(this.actor)
      result = action.update()
    }

    // provide context for decider
    context.result = result

    // transition to next state with the given context
    return this.nextState(this.actor, states.INITIALIZING, context)
  }
}
