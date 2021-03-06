'use strict'

class Upgrader extends Role {
  get bodyPattern() { return [WORK, WORK, CARRY, CARRY, MOVE] }
  get maxCreepSize() { return this.bodyPattern.length * 6 }

  findTargetTypes(state) {
    switch (state) {
      case 'Refilling': {
        return [
          [
            FIND_CONTROLLER_CONTAINER,
          ],
          [
            FIND_DROPPED_RESOURCES,
            FIND_TOMBSTONES,
            FIND_RUINS,
            FIND_STORAGE,
          ],
          [
            FIND_CONTAINERS,
            FIND_SOURCES_ACTIVE,
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
        [State.SUCCESS]: 'Upgrading',
        [State.FAILED]: 'Recycling',
      },
      'Upgrading': {
        [State.SUCCESS]: 'Refilling',
        [State.FAILED]: 'Recycling',
      },
      'Recycling': {},
    }

    return transitions
  }
}

global.Upgrader = Upgrader
