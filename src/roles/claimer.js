'use strict'

class Claimer extends Role {
  get bodyPattern() { return [CLAIM, MOVE] }

  number(room) {
    const needsClaimer = _.some(World.territory, 'needsClaimer')

    return needsClaimer ? 1 : 0
  }

  nextState(context) {
    const actor = this.actor
    const result = context.result
    const currentState = context.currentState
    let nextState = context.currentState

    switch (currentState) {
      case 'Spawning':
        if (!actor.spawning) {
          nextState = 'Claiming'
        }

        break
      case 'Claiming':
        if (State.SUCCESS === result) {
          nextState = 'Recycling'
          break
        }

        if (State.FAILED === result) {
          nextState = 'Recycling'
          break
        }

        break
      case 'Recycling':
        break
      default:
        console.log('CLAIMER', 'unhandled state', currentState, JSON.stringify(context))
        break
    }

    return nextState
  }
}

global.Claimer = Claimer
