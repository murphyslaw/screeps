'use strict'

global.Defending = class extends global.State {
  get target() {
    let target = this.actor.target

    if (!target) {
      target = this.actor.target = this.actor.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
    }

    return target
  }

  run() {
    let result = OK
    let context = {}

    // check prerequisites
    if (!this.target) { result = ERR_INVALID_TARGET }

    // execute action
    if (OK === result) {
      const action = new Attack(this.actor, this.target)
      result = action.update()
    }

    // provide context for decider
    context.result = result

    switch (result) {
      case ERR_NOT_IN_RANGE:
        context.target = this.target
        break
    }

    // transition to next state with the given context
    return this.nextState(this.actor, states.DEFENDING, context)
  }
}
