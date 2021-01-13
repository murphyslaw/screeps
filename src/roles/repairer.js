'use strict'

class Repairer extends Role {
  get bodyPattern() { return [WORK, CARRY, MOVE] }
  get maxCreepSize() { return this.bodyPattern.length * 5 }

  get transitions() {
    const transitions = {
      'Spawning': {
        [State.SUCCESS]: 'Refilling',
      },
      'Refilling': {
        [State.SUCCESS]: 'Repairing',
        [State.FAILED]: 'Recycling',
      },
      'Repairing': {
        [State.SUCCESS]: 'Refilling',
        [State.FAILED]: 'Idling',
      },
      'Idling': {
        [State.SUCCESS]: 'Repairing',
        [State.FAILED]: 'Recycling',
      },
      'Recycling': {},
    }

    return transitions
  }
}

global.Repairer = Repairer
