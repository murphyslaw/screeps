'use strict'

global.Dismantling = class extends State {
  get target() {
    const roomName = 'W20N30'
    let target = this.actor.target

    if (!target) {
      const monument = new Monument(roomName)
      const start = new RoomPosition(38, 27, roomName)
      target = this.actor.target = monument.blocker(start)
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
      const action = new Dismantle(this.actor, this.target)
      result = action.update()
    }

    // provide context for decider
    context.result = result

    switch (result) {
      case ERR_NOT_IN_RANGE:
        context.target = this.target
        break
    }

    // resolve the next state
    let nextState = this.nextState(this.actor, states.DISMANTLING, context)

    return nextState
  }
}
