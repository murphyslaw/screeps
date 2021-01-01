'use strict'

class Harvester extends Role {
  get bodyPattern() { return [WORK, CARRY, MOVE] }
  get maxCreepSize() { return this.bodyPattern.length * 5 }

  number(room) {
    const slots = _.sum(World.myRooms, function(room) {
      return _.sum(room.sources, function(source) {
        return source.container ? 0 : source.freeSpaceCount
      })
    })

    return slots
  }

  nextState(context) {
    const actor = this.actor
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
        console.log('HARVESTER', 'unhandled state', currentState, JSON.stringify(context))
        break
    }

    return nextState
  }
}

global.Harvester = Harvester
