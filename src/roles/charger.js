'use strict'

class Charger extends Role {
  get bodyPattern() { return [CARRY, MOVE] }
  get maxCreepSize() { return this.bodyPattern.length * 6 }

  findTargetTypes(state) {
    switch (state) {
      case 'Refilling': {
        return [
          FIND_STORAGE,
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

global.Charger = Charger
