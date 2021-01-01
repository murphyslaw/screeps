'use strict'

class RemoteHarvester extends Role {
  get bodyPattern() { return [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE] }
  get maxCreepSize() { return this.bodyPattern.length * 2 }

  number(room) {
    if (room.level < 4) return 0

    const rooms = World.remoteRooms
    let number = 0

    number += _.sum(rooms, function(room) {
      return _.filter(room.sources, source => !source.container).length
    })

    return number
  }

  nextState(context) {
    const actor = this.actor
    const result = context.result
    const currentState = context.currentState
    let nextState = context.currentState

    switch (currentState) {
      case 'Spawning':
        if (!actor.spawning) {
          nextState = 'RemoteHarvesting'
          break
        }

        break
      case 'RemoteHarvesting':
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
          nextState = 'RemoteHarvesting'
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
        console.log('REMOTEHARVESTER', 'unhandled state', currentState, JSON.stringify(context))
        break
    }

    return nextState
  }
}

global.RemoteHarvester = RemoteHarvester
