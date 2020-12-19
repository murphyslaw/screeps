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
    if (!this.actor.dest) { result = ERR_INVALID_TARGET }

    // execute action
    if (OK === result) {
      const action = new Move(this.actor, this.actor.dest)
      result = action.update()
    }

    // provide context for decider
    context.result = result

    // resolve the next state
    let nextState = this.nextState(this.actor, states.MOVING, context)

    return nextState
  }
}
