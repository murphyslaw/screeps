'use strict'

global.Moving = class extends State {
  constructor(actor, nextState) {
    super(actor, nextState)
  }

  run() {
    let result = OK
    let context = {}

    // check prerequisites
    if (!this.actor.destination) { result = ERR_INVALID_TARGET }

    // execute action
    if (OK === result) {
      const action = new Move(this.actor, this.actor.destination)
      result = action.update()
    }

    // provide context for decider
    context.result = result

    // transition to next state with the given context
    return this.nextState(this.actor, states.MOVING, context)
  }
}
