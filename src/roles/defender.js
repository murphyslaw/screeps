'use strict'

class Defender extends Creepy {
  get bodyPattern() { return [TOUGH, TOUGH, ATTACK, ATTACK, MOVE, MOVE] }
  get maxCreepSize() { return this.bodyPattern.length * 4 }

  number(room) {
    const underAttack = _.some(World.territory, 'underAttack')

    return underAttack ? 1 : 0
  }

  nextState(context) {
    const actor = context.actor
    const result = context.result
    const currentState = context.currentState
    let nextState = context.currentState

    switch (currentState) {
      case 'Spawning':
        if (State.SUCCESS === result) {
          nextState = 'Defending'
        }

        break
      case 'Defending':
        if (State.SUCCESS === result) {
          nextState = 'Recycling'
        }

        if (State.FAILED === result) {
          nextState = 'Recycling'
        }

        break
      case 'Recycling':
        break
      default:
        console.log('DEFENDER', 'unhandled state', currentState, JSON.stringify(context))
        break
    }

    return nextState
  }
}

global.Defender = Defender
