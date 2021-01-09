'use strict'

class Claimer extends Role {
  get bodyPattern() { return [CLAIM, MOVE] }

  get number() {
    const needsClaimer = _.some(World.territory, 'needsClaimer')

    return needsClaimer ? 1 : 0
  }

  get transitions() {
    const transitions = {
      'Spawning': {
        [State.SUCCESS]: 'Claiming',
      },
      'Claiming': {
        [State.SUCCESS]: 'Recycling',
        [State.FAILED]: 'Recycling',
      },
      'Recycling': {}
    }

    return transitions
  }
}

global.Claimer = Claimer
