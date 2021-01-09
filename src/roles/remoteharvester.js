'use strict'

class RemoteHarvester extends Role {
  get bodyPattern() { return [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE] }
  get maxCreepSize() { return this.bodyPattern.length * 2 }

  get number() {
    if (_.every(World.myRooms, room => room.level < 4)) return 0

    const rooms = World.remoteRooms
    let number = 0

    number += _.sum(rooms, function(room) {
      return _.filter(room.sources, source => !source.container).length
    })

    return number
  }

  get transitions() {
    const transitions = {
      'Spawning': {
        [State.SUCCESS]: 'RemoteHarvesting',
      },
      'RemoteHarvesting': {
        [State.SUCCESS]: 'Distributing',
        [State.FAILED]: 'Recycling',
      },
      'Distributing': {
        [State.SUCCESS]: 'RemoteHarvesting',
        [State.FAILED]: 'Recycling',
      },
      'Recycling': {},
    }

    return transitions
  }
}

global.RemoteHarvester = RemoteHarvester
