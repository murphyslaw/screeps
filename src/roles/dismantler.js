'use strict'

global.Dismantler = class extends Creepy {
  get name() { return 'dismantler' }

  get bodyPattern() { return [WORK, MOVE] }
  get maxCreepSize() { return MAX_CREEP_SIZE }

  get states() {
    return {
      [states.INITIALIZING]: Initializing,
      [states.DISMANTLING]: Dismantling,
      [states.RECYCLING]: Recycling,
    }
  }

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
