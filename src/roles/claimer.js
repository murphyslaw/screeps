'use strict'

class Claimer extends Creepy {
  get bodyPattern() { return [CLAIM, MOVE] }

  number(room) {
    const needsClaimer = _.some(World.territory, 'needsClaimer')

    return needsClaimer ? 1 : 0
  }

  nextState(context) {
    const actor = context.actor
    const result = context.result
    const currentState = context.currentState
    let nextState = context.currentState

    switch (currentState) {
      case states.INITIALIZING:
        if (!actor.spawning) {
          nextState = states.CLAIMING
        }

        break
      case states.CLAIMING:
        if (State.SUCCESS === result) {
          nextState = states.RECYCLING
          break
        }

        if (State.FAILED === result) {
          nextState = states.RECYCLING
          break
        }

        break
      case states.RECYCLING:
        break
      default:
        console.log('CLAIMER', 'unhandled state', currentState, JSON.stringify(context))
        break
    }

    return nextState
  }
}

global.Claimer = Claimer
