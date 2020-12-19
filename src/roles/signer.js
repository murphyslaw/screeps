'use strict'

global.Signer = class extends Creepy {
  get name() { return 'signer' }

  get bodyPattern() { return [MOVE] }

  get startState() { return states.SIGNING }

  get states() {
    return {
      [states.SIGNING]: Signing,
      [states.MOVING]: Moving,
      [states.RECYCLING]: Recycling,
    }
  }

  number(room) {
    return !room.controller.sign ? 1 : 0
  }

  nextState(actor, state, context) {
    let nextState = state

    switch(state) {
      case states.SIGNING:
        if (OK === context.result) {
          nextState = states.RECYCLING
        }

        if (ERR_NOT_IN_RANGE === context.result) {
          actor.destination = context.controller
          nextState = states.MOVING
          break
        }

        if (ERR_INVALID_TARGET === context.result) {
          nextState = states.RECYCLING
          break
        }

        break
      case states.MOVING:
        if (ERR_INVALID_TARGET === context.result) {
          nextState = states.RECYCLING
          break
        }

        const target = actor.target

        if (actor.pos.isNearTo(target)) {
          switch(target.structureType) {
            case STRUCTURE_CONTROLLER:
              nextState = states.SIGNING
              break
            case STRUCTURE_SPAWN:
              nextState = states.RECYCLING
              break
          }

          break
        }

        break
      case states.RECYCLING:
        if (ERR_NOT_IN_RANGE === context.result) {
          actor.destination = context.spawn
          nextState = states.MOVING
          break
        }

        break
      default:
        console.log('SIGNER', 'unhandled state', state, JSON.stringify(context))
        break
    }

    return nextState
  }
}
