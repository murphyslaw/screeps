'use strict'

class RemoteHauler extends Role {
  get bodyPattern() { return [CARRY, MOVE] }
  get maxCreepSize() { return this.bodyPattern.length * 12 }
  get resource() { return null }

  get rooms() {
    return this.actor.home.remotes
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
