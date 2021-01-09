'use strict'

class Harvester extends Role {
  get bodyPattern() { return [WORK, CARRY, MOVE] }
  get maxCreepSize() { return this.bodyPattern.length * 5 }

  get number() {
    const slots = _.sum(World.myRooms, function(room) {
      return _.sum(room.sources, function(source) {
        return source.container ? 0 : source.freeSpaceCount
      })
    })

    return slots
  }

  get transitions() {
    const transitions = {
      'Spawning': {
        [State.SUCCESS]: 'Harvesting',
      },
      'Harvesting': {
        [State.SUCCESS]: 'Distributing',
        [State.FAILED]: 'Recycling',
      },
      'Distributing': {
        [State.SUCCESS]: 'Harvesting',
        [State.FAILED]: 'Recycling',
      },
      'Recycling': {},
    }

    return transitions
  }
}

global.Harvester = Harvester
