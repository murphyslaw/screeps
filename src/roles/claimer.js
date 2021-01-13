'use strict'

class Claimer extends Role {
  get bodyPattern() { return [CLAIM, MOVE] }

  get transitions() {
    const transitions = {
      'Spawning': {
        [State.SUCCESS]: 'Claiming',
      },
      'Claiming': {
        [State.SUCCESS]: 'Signing',
        [State.FAILED]: 'Recycling',
      },
      'Signing': {
        [State.SUCCESS]: 'Recycling',
        [State.FAILED]: 'Recycling',
      },
      'Recycling': {}
    }

    return transitions
  }
}

global.Claimer = Claimer
