'use strict'

global.Dismantler = class extends Creepy {
  get name() { return 'dismantler' }

  get bodyPattern() { return [WORK, MOVE] }
  get maxCreepSize() { return this.bodyPattern.length * 14 }

  get states() {
    return {
      [states.INITIALIZING]: Initializing,
      [states.MOVING]: Moving,
      [states.DISMANTLING]: Dismantling,
    }
  }

  number(room) { return 2 }

  nextState(actor, state, context) {
    let nextState = state

    switch (state) {
      case states.INITIALIZING:
        if (!actor.spawning) {
          actor.destination = new RoomPosition(25, 25, 'W20N30')
          nextState = states.MOVING
        }

        break
      case states.DISMANTLING:
        if (ERR_INVALID_TARGET === context.result) {
          nextState = states.RECYCLING
          break
        }

        if (ERR_NOT_IN_RANGE === context.result) {
          actor.destination = context.target.pos
          nextState = states.MOVING
          break
        }

        break
      case states.MOVING:
        if (ERR_INVALID_TARGET === context.result) {
          nextState = states.RECYCLING
          break
        }

        if (actor.inDestinationRoom && !actor.target) {
          nextState = states.DISMANTLING
          break
        }

        if (actor.pos.isNearTo(actor.destination)) {
          nextState = states.DISMANTLING
          break
        }

        break
      case states.RECYCLING:
        nextState = states.MOVING

        if (ERR_NOT_IN_RANGE === context.result) {
          actor.destination = context.spawn
          nextState = states.MOVING
          break
        }

        break
      default:
        console.log('DISMANTLER', 'unhandled state', state, JSON.stringify(context))
        break
    }

    return nextState
  }
}
