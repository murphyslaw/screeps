'use strict'

class RemoteHauler extends Creepy {
  get bodyPattern() { return [CARRY, MOVE] }
  get maxCreepSize() { return this.bodyPattern.length * 6 }

  number(room) {
    let rooms = World.remoteRooms
    let number = 0

    number += _.sum(rooms, room => room.sourceContainers.length)
    number += _.sum(rooms, room => room.mineralContainers.length)

    return number
  }

  findTargetTypes(state) {
    switch(state) {
      case 'Refilling': {
        return [
          FIND_DROPPED_RESOURCES,
          FIND_TOMBSTONES,
          FIND_RUINS,
          FIND_CONTAINERS,
        ]
      }
    }

    return []
  }

  get resource() { return RESOURCE_ENERGY }

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
          nextState = 'Storing'
          break
        }

        if (State.FAILED === result) {
          nextState = 'Recycling'
          break
        }

        break
      case 'Storing':
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
        console.log('REMOTEHAULER', 'unhandled state', currentState, JSON.stringify(context))
        break
    }

    return nextState
  }
}

global.RemoteHauler = RemoteHauler
