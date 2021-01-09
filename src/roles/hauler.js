'use strict'

class Hauler extends Role {
  get bodyPattern() { return [CARRY, MOVE] }
  get maxCreepSize() { return this.bodyPattern.length * 10 }

  get number() {
    let rooms = World.myRooms
    let number = 0

    number += _.sum(rooms, room => room.sourceContainers.length)
    number += _.sum(rooms, room => room.extractors.length)

    return number
  }

  findTargetTypes(state) {
    switch (state) {
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
          [
            FIND_STORAGE,
          ],
        ]
      }
    }

    return []
  }

  get transitions() {
    const transitions = {
      'Spawning': {
        [State.SUCCESS]: 'Refilling',
      },
      'Refilling': {
        [State.SUCCESS]: 'Distributing',
        [State.FAILED]: 'Idling',
      },
      'Distributing': {
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

global.Hauler = Hauler
