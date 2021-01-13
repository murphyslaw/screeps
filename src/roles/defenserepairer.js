'use strict'

class DefenseRepairer extends Role {
  get bodyPattern() { return [WORK, CARRY, MOVE] }
  get maxCreepSize() { return this.bodyPattern.length * 5 }

  get transitions() {
    const transitions = {
      'Spawning': {
        [State.SUCCESS]: 'Refilling',
      },
      'Refilling': {
        [State.SUCCESS]: 'DefenseRepairing',
        [State.FAILED]: 'Recycling',
      },
      'DefenseRepairing': {
        [State.SUCCESS]: 'Refilling',
        [State.FAILED]: 'Idling',
      },
      'Idling': {
        [State.SUCCESS]: 'DefenseRepairing',
        [State.FAILED]: 'Recycling',
      },
      'Recycling': {}
    }

    return transitions
  }
}

global.DefenseRepairer = DefenseRepairer
