'use strict'

class RemoteHauler extends Role {
  get bodyPattern() { return [CARRY, MOVE] }
  get maxCreepSize() { return this.bodyPattern.length * 12 }
  get resource() { return null }

  get number() {
    let rooms = World.remoteRooms
    let number = 0

    number += _.sum(rooms, room => room.sourceContainers.length)
    number += _.sum(rooms, room => room.mineralContainer ? 1 : 0)

    return number
  }

  get rooms() {
    return World.remoteRooms
  }

  findTargetTypes(state) {
    switch(state) {
      case 'Refilling': {
        return [
          [
            FIND_DROPPED_RESOURCES,
            FIND_TOMBSTONES,
            FIND_RUINS,
          ],
          [
            FIND_SOURCE_CONTAINERS,
          ],
        ]
      }
    }

    return []
  }

  get resource() { return RESOURCE_ENERGY }

  get transitions() {
    const transitions = {
      'Spawning': {
        [State.SUCCESS]: 'Refilling',
      },
      'Refilling': {
        [State.SUCCESS]: 'Storing',
        [State.FAILED]: 'Idling',
      },
      'Storing': {
        [State.SUCCESS]: 'Refilling',
        [State.FAILED]: 'Idling',
      },
      'Idling': {
        [State.SUCCESS]: 'Refilling',
        [State.FAILED]: 'Recycling',
      },
      'Recycling': {},
    }

    return transitions
  }
}

global.RemoteHauler = RemoteHauler
