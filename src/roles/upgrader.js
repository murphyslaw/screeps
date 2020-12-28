'use strict'

class Upgrader extends Creepy {
  get bodyPattern() { return [WORK, CARRY, MOVE] }
  get maxCreepSize() { return this.bodyPattern.length * 6 }

  number(room) {
    const controllerContainerUsedCapacity = _.sum(World.myRooms, function(room) {
      const controllerContainer = room.controller.container;
      return controllerContainer ? controllerContainer.store.getUsedCapacity(RESOURCE_ENERGY) : 0
    })

    const number = Math.max(Math.floor(controllerContainerUsedCapacity / 400), World.myRooms.length + 1)

    return number
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
      case 'Refilling':
        if (State.SUCCESS === result) {
          nextState = 'Upgrading'
          break
        }

        if (State.FAILED === result) {
          nextState = 'Recycling'
          break
        }

        break
      case 'Upgrading':
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
        console.log(this.name.toUpperCase(), 'unhandled state', currentState, JSON.stringify(context))
        break
    }

    return nextState
  }
}

global.Upgrader = Upgrader
