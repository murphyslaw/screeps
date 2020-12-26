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
      case 'Spawning':
        if (!actor.spawning) {
          nextState = 'Refilling'
          break
        }

        break
      case 'Building':
        if (State.SUCCESS === result) {
          nextState = 'Refilling'
          break
        }

        if (State.FAILED === result) {
          nextState = 'Recycling'
          break
        }

        break
      case 'Refilling':
        if (State.SUCCESS === result) {
          nextState = 'Building'
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
        console.log('BUILDER', 'unhandled state', currentState, JSON.stringify(context))
        break
    }

    return nextState
  }
}

global.Builder = Builder
