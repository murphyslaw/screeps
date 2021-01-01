'use strict'

class Signer extends Creepy {
  get bodyPattern() { return [MOVE] }

  number(room) {
    const needsSigner = _.some(World.myRooms, 'needsSigner')

    return needsSigner ? 1 : 0
  }

  nextState(context) {
    const actor = this.actor
    const result = context.result
    const currentState = context.currentState
    let nextState = context.currentState

    switch (currentState) {
      case 'Spawning':
        if (!actor.spawning) {
          nextState = 'Signing'
        }

        break
      case 'Signing':
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
        console.log('SIGNER', 'unhandled state', currentState, JSON.stringify(context))
        break
    }

    return nextState
  }
}

global.Signer = Signer
