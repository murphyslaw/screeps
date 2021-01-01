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
  get resource() { return RESOURCE_SCORE }

  number(room) { return 5 }

  nextState(context) {
    const actor = this.actor
    const result = context.result
    const currentState = context.currentState
    let nextState = context.currentState

    switch (currentState) {
      case 'Spawning':
        if (State.SUCCESS === result) {
          return 'Refilling'
        }

        break
      case 'Scoring':
        if (State.SUCCESS === result) {
          return 'Refilling'
        }

        if (State.FAILED === result) {
          return 'Recycling'
        }

        break
      case 'Refilling':
        if (actor.inDestinationRoom && actor.ticksToLive < 700) {
          return 'Recycling'
        }

        if (State.SUCCESS === result) {
          return 'Scoring'
        }

        if (State.FAILED === result) {
          return 'Recycling'
        }

        break
      case 'Recycling':
        break
      default:
        console.log('SCORER', 'unhandled state', currentState, JSON.stringify(context))
        break
    }

    return nextState
  }
}

global.Scorer = Scorer
