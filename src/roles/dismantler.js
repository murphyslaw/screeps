'use strict'

class Dismantler extends Creepy {
  get bodyPattern() {
    return [
      WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
      WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
      WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE,
      MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
      MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
    ]
  }
  get maxCreepSize() { return MAX_CREEP_SIZE }

  number(room) { return 1 }

  nextState(context) {
    const actor = context.actor
    const result = context.result
    const state = context.currentState
    let nextState = context.currentState

    switch (state) {
      case states.INITIALIZING:
        if (State.SUCCESS === result) {
          nextState = states.DISMANTLING
        }

        break
      case states.DISMANTLING:
        break
      case states.RECYCLING:
        break
      default:
        console.log('DISMANTLER', 'unhandled state', state, JSON.stringify(context))
        break
    }

    return nextState
  }
}

global.Dismantler = Dismantler
