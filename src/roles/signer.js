'use strict'

class Signer extends Role {
  get bodyPattern() { return [MOVE] }

  get number() {
    const needsSigner = _.some(World.territory, 'needsSigner')

    return needsSigner ? 1 : 0
  }

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
