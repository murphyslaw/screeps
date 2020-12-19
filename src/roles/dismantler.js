'use strict'

global.Dismantler = class extends Creepy {
  get name() { return 'dismantler' }

  get bodyPattern() { return [WORK, MOVE] }

  get startState() { return states.MOVING }

  get states() {
    return {
      [states.MOVING]: Moving,
      [states.DISMANTLING]: Recycling,
    }
  }

  number(room) { return 1 }

  nextState(actor, state, context) {
    let nextState = state

    switch (state) {
      case states.DISMANTLING:
        if (OK === context.result) {

        }

        if (ERR_NOT_IN_RANGE === context.result) {
          actor.target = context.scoreCollector
          nextState = states.MOVING
          break
        }

        break
      case states.MOVING:
        break
      case states.RECYCLING:
        if (ERR_NOT_IN_RANGE === context.result) {
          actor.target = context.spawn
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
