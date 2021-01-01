'use strict'

class Supplier extends Creepy {
  get bodyPattern() { return [CARRY, MOVE] }
  get maxCreepSize() { return this.bodyPattern.length * 5 }

  number(room) {
    return room.storage && room.controllerContainer ? 0 : 0
  }

  findTargetTypes(state) {
    switch (state) {
      case 'Refilling': {
        return [
          FIND_STORAGE,
        ]
      }

      case 'Distributing': {
        return [
          [
            FIND_MY_SPAWNS,
            FIND_EXTENSIONS,
            FIND_TOWERS,
          ],
          [
            FIND_CONTROLLER_CONTAINER,
          ],
        ]
      }
    }

    return []
  }

  nextState(context) {
    const actor = this.actor
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
      case 'Refilling':
        if (State.SUCCESS === result) {
          nextState = 'Distributing'
          break
        }

        if (State.FAILED === result) {
          nextState = 'Recycling'
          break
        }

        break
      case 'Distributing':
        if (State.SUCCESS === result) {
          nextState = 'Refilling'
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
        console.log('SUPPLIER', 'unhandled state', currentState, JSON.stringify(context))
        break
    }

    return nextState
  }
}

global.Supplier = Supplier
