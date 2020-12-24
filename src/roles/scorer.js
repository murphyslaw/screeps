'use strict'

class Scorer extends Creepy {
  get bodyPattern() {
    return [
      CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE,
      CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE,
      CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE,
      CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE,
      CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE,
    ]
  }
  get maxCreepSize() { return MAX_CREEP_SIZE }

  number(room) { return 2 }

  nextState(context) {
    const actor = context.actor
    const result = context.result
    const currentState = context.currentState
    let nextState = context.currentState

    switch (currentState) {
      case states.INITIALIZING:
        if (State.SUCCESS === result) {
          return states.REFILLING
        }

        break
      case states.SCORING:
        if (State.SUCCESS === result) {
          return states.REFILLING
        }

        if (State.FAILED === result) {
          // return states.RECYCLING
        }

        break
      case states.REFILLING:
        if (actor.inDestinationRoom && actor.ticksToLive < 700) {
          // return states.RECYCLING
        }

        if (State.SUCCESS === result) {
          return states.SCORING
        }

        if (State.FAILED === result) {
          // return states.RECYCLING
        }

        break
      case states.RECYCLING:
        break
      default:
        console.log('SCORER', 'unhandled state', currentState, JSON.stringify(context))
        break
    }

    return nextState
  }
}

global.Scorer = Scorer
