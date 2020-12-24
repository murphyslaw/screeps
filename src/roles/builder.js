'use strict'

class Builder extends Creepy {
  get bodyPattern() { return [WORK, CARRY, MOVE] }
  get maxCreepSize() { return this.bodyPattern.length * 12 }

  number(room) {
    const needsBuilder = _.some(World.territory, 'needsBuilder')

    return needsBuilder ? 2 : 0
  }

  nextState(context) {
    const actor = context.actor
    const result = context.result
    const currentState = context.currentState
    let nextState = context.currentState

    switch (currentState) {
      case states.INITIALIZING:
        if (!actor.spawning) {
          nextState = states.REFILLING
          break
        }

        break
      case states.BUILDING:
        if (State.SUCCESS === result) {
          nextState = states.REFILLING
          break
        }

        if (State.FAILED === result) {
          nextState = states.RECYCLING
          break
        }

        break
      case states.REFILLING:
        if (State.SUCCESS === result) {
          nextState = states.BUILDING
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
        console.log('BUILDER', 'unhandled state', currentState, JSON.stringify(context))
        break
    }

    return nextState
  }
}

global.Builder = Builder
