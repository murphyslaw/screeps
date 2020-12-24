'use strict'

class Repairer extends Creepy {
  get bodyPattern() { return [WORK, CARRY, MOVE] }
  get maxCreepSize() { return this.bodyPattern.length * 5 }

  number(room) {
    const needsRepairer = _.some(World.territory, 'needsRepairer')

    return needsRepairer ? 2 : 0
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
      case states.IDLE:
        if (State.SUCCESS === result) {
          nextState = states.REPAIRING
          break
        }

        if (State.FAILED === result) {
          nextState = states.RECYCLING
          break
        }

        break
      case states.REPAIRING:
        if (State.SUCCESS === result) {
          nextState = states.REFILLING
          break
        }

        if (State.FAILED === result) {
          nextState = states.IDLE
          break
        }

        break
      case states.REFILLING:
        if (State.SUCCESS === result) {
          nextState = states.REPAIRING
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
        console.log('REPAIRER', 'unhandled state', currentState, JSON.stringify(context))
        break
    }

    return nextState
  }
}

global.Repairer = Repairer
