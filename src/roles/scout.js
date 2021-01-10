'use strict'

class Scout extends Role {
  get bodyPattern() { return [MOVE] }

  get number() { return 1 }

  get transitions() {
    const transitions = {
      'Spawning': {
        [State.SUCCESS]: 'Scouting',
      },
      'Scouting': {
        [State.FAILED]: 'Recycling',
      },
      'Recycling': {},
    }

    return transitions
  }
}

global.Scout = Scout
