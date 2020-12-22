'use strict'

global.Defender = class extends Creepy {
  get name() { return 'defender' }

  get bodyPattern() { return [TOUGH, TOUGH, ATTACK, ATTACK, MOVE, MOVE] }
  get maxCreepSize() { return this.bodyPattern.length * 4 }

  get states() {
    return {
      [states.INITIALIZING]: Initializing,
      [states.DEFENDING]: Defending,
      [states.RECYCLING]: Recycling,
    }
  }

  number(room) {
    const underAttack = _.some(World.territory, 'underAttack')

    return underAttack ? 0 : 0
  }

  nextState(context) {
    const actor = context.actor
    const result = context.result
    const state = context.currentState
    let nextState = context.currentState

    switch(state) {
      case states.INITIALIZING:
        if (State.SUCCESS === result) {
          nextState = states.DEFENDING
        }

        break
      case states.DEFENDING:
        if (State.SUCCESS === result) {
          nextState = states.RECYCLING
        }

        break
      case states.RECYCLING:
        break
      default:
        console.log('DEFENDER', 'unhandled state', state, JSON.stringify(context))
        break
    }

    return nextState
  }
}
