'use strict'

class Supplier extends Role {
  get bodyPattern() { return [CARRY, MOVE] }
  get maxCreepSize() { return this.bodyPattern.length * 2 }
  get resource() { return null }

  get rooms() {
    const rooms = [this.actor.home]

    return rooms
  }

  findTargetTypes(state) {
    switch (state) {
      case 'Refilling': {
        return [
          FIND_MINERAL_CONTAINER,
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

global.Supplier = Supplier
