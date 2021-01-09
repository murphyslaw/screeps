'use strict'

class Reserver extends Role {
  get bodyPattern() { return [CLAIM, CLAIM, MOVE, MOVE] }

  get number() {
    const needsReserver = _.some(World.territory, 'needsReserver')

    return needsReserver ? 1 : 0
  }

  get transitions() {
    const transitions = {
      'Spawning': {
        [State.SUCCESS]: 'Reserving',
      },
      'Reserving': {
        [State.SUCCESS]: 'Idling',
        [State.FAILED]: 'Idling',
      },
      'Idling': {
        [State.SUCCESS]: 'Reserving',
        [State.FAILED]: 'Recycling',
      },
      'Recycling': {},
    }

    return transitions
  }
}

global.Reserver = Reserver
