'use strict'

global.Creepy = class extends Role {
  get startState() { return states.INITIALIZING }
  get states() { return {} }

  nextState(context) { throw Error('not implemented') }

  run(actor) {
    let state = actor.state

    if (!state) {
      state = actor.state = this.startState
    }

    const stateClass = this.states[state]

    if (stateClass) {
      const stateInstance = new stateClass(actor, this.nextState)
      const nextState = stateInstance.run()

      if (actor.state !== nextState) stateInstance.exit()

      actor.state = nextState
    }
  }
}
