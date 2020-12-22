'use strict'

global.Scorer = class extends Creepy {
  get name() { return 'scorer' }

  get bodyPattern() { return [CARRY, MOVE] }
  get maxCreepSize() { return this.bodyPattern.length * 5 }

  get states() {
    return {
      [states.INITIALIZING]: Initializing,
      [states.SCORING]: Scoring,
      [states.REFILLING]: Refilling,
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
          nextState = states.REFILLING
          break
        }

        break
      case states.SCORING:
        if (State.SUCCESS === result) {
          actor.destination = null
          actor.target = null
          nextState = states.RECYCLING
          break
        }

        if (State.FAILED === result) {
          nextState = states.RECYCLING
          break
        }

        break
      case states.REFILLING:
        if (State.SUCCESS === result) {
          actor.destination = null
          actor.target = null
          nextState = states.SCORING
          break
        }

        if (State.FAILED === result) {
          nextState = states.RECYCLING
          break
        }
      case states.RECYCLING:
        break
      default:
        console.log('SCORER', 'unhandled state', state, JSON.stringify(context))
        break
    }

    return nextState
  }
}
