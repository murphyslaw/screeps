'use strict'

class Signer extends Role {
  get bodyPattern() { return [MOVE] }

  get transitions() {
    const transitions = {
      'Spawning': {
        [State.SUCCESS]: 'Signing',
      },
      'Signing': {
        [State.SUCCESS]: 'Recycling',
        [State.FAILED]: 'Recycling',
      },
      'Recycling': {},
    }

    return transitions
  }
}

global.Signer = Signer
