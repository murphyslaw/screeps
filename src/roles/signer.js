'use strict'

class Signer extends Creepy {
  get bodyPattern() { return [MOVE] }

  number(room) {
    const needsSigner = _.some(World.myRooms, 'needsSigner')

    return needsSigner ? 1 : 0
  }

  nextState(context) {
    const actor = context.actor
    const result = context.result
    const currentState = context.currentState
    let nextState = context.currentState

    switch (currentState) {
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
        console.log('SIGNER', 'unhandled state', currentState, JSON.stringify(context))
        break
    }

    return nextState
  }
}

global.Signer = Signer
