'use strict'

class ContainerHarvester extends Creepy {
  get bodyPattern() { return [WORK, WORK, WORK, WORK, WORK, MOVE] }

  number(room) {
    return _.sum(World.myRooms, room => room.sourceContainers.length)
  }

  nextState(context) {
    const actor = context.actor
    const result = context.result
    const currentState = context.currentState
    let nextState = context.currentState

    switch (currentState) {
      case 'Spawning':
        if (!actor.spawning) {
          nextState = 'Harvesting'
          break
        }

        break
      case 'Harvesting':
        if (State.SUCCESS === result) {
          nextState = 'Harvesting'
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
        console.log('CONTAINERHARVESTER', 'unhandled state', currentState, JSON.stringify(context))
        break
    }

    return nextState
  }
}

global.ContainerHarvester = ContainerHarvester
