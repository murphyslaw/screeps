'use strict'

class Repairer extends Creepy {
  get bodyPattern() { return [WORK, CARRY, MOVE] }
  get maxCreepSize() { return this.bodyPattern.length * 5 }

  number(room) {
    const needsRepairer = _.some(World.territory, 'needsRepairer')

    return needsRepairer ? 1 : 0
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
      case 'Idling':
        if (State.SUCCESS === result) {
          nextState = 'Repairing'
          break
        }

        if (State.FAILED === result) {
          nextState = 'Recycling'
          break
        }

        break
      case 'Repairing':
        if (State.SUCCESS === result) {
          nextState = 'Refilling'
          break
        }

        if (State.FAILED === result) {
          nextState = 'Idling'
          break
        }

        break
      case 'Refilling':
        if (State.SUCCESS === result) {
          nextState = 'Repairing'
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
        console.log('REPAIRER', 'unhandled state', currentState, JSON.stringify(context))
        break
    }

    return nextState
  }
}

global.Repairer = Repairer
