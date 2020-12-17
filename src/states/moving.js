'use strict'

global.Moving = class extends State {
  constructor(actor, nextState) {
    super(actor, nextState)
  }

  run() {
    console.log('STATE', 'MOVING', 'RUN')

    let result = OK
    let context = {}

    // check prerequisites
    if (!this.actor.target) { result = ERR_INVALID_TARGET }

    // execute action
    let action = new Move(this.actor, this.actor.target)
    result = action.update()

    // provide context for decider
    context.result = result

    // resolve the next state
    let nextState = this.nextState(this.actor, states.MOVING, context)

    return nextState
  }
}
