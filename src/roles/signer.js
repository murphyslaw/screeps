'use strict'

global.Signer = class extends Creepy {
  get name() { return 'signer' }

  get bodyPattern() { return [MOVE] }

  get states() {
    return {
      [states.INITIALIZING]: Initializing,
      [states.SIGNING]: Signing,
      [states.RECYCLING]: Recycling,
    }
  }

  number(room) {
    return !room.controller.sign ? 1 : 0
  }

  nextState(context) {
    const actor = context.actor
    const result = context.result
    const state = context.currentState
    let nextState = context.currentState

    switch (state) {
      case states.INITIALIZING:
        if (!actor.spawning) {
          nextState = states.SIGNING
        }

        break
      case states.SIGNING:
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
        console.log('SIGNER', 'unhandled state', state, JSON.stringify(context))
        break
    }

    return nextState
  }
}
