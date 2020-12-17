'use strict'

global.Creepy = class extends Role {
  get startState() { return states.INITIALIZING }

  run(actor) {
    let state = actor.state

    if (!state) {
      state = actor.state = this.startState
    }

    const stateClass = this.states[state]

    if (stateClass) {
      const stateInstance = new stateClass(actor, this.nextState)
      actor.state = stateInstance.run()
    }
  }
}
