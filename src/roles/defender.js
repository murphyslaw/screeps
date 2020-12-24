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
      case states.INITIALIZING:
        if (State.SUCCESS === result) {
          nextState = states.DEFENDING
        }

        break
      case states.DEFENDING:
        if (State.SUCCESS === result) {
          nextState = states.RECYCLING
        }

        if (State.FAILED === result) {
          nextState = states.RECYCLING
        }

        break
      case states.RECYCLING:
        break
      default:
        console.log('DEFENDER', 'unhandled state', currentState, JSON.stringify(context))
        break
    }

    return nextState
  }
}

global.Defender = Defender
