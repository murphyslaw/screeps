'use strict'

class RemoteHarvester extends Role {
  get bodyPattern() { return [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE] }
  get maxCreepSize() { return this.bodyPattern.length * 2 }

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
