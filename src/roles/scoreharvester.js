'use strict'

class ScoreHarvester extends Role {
  get bodyPattern() { return [CARRY, MOVE] }
  get maxCreepSize() { return this.bodyPattern.length * 12 }
  get resource() { return RESOURCE_SCORE }

  get number() {
    const needsScoreHarvester = _.some(World.knownRooms, 'needsScoreHarvester')

    return needsScoreHarvester ? 3 : 0
  }

  get transitions() {
    const transitions = {
      'Spawning': {
        [State.SUCCESS]: 'Collecting',
      },
      'Collecting': {
        [State.SUCCESS]: 'Storing',
        [State.FAILED]: 'Recycling',
      },
      'Storing': {
        [State.SUCCESS]: 'Collecting',
        [State.FAILED]: 'Recycling',
      },
      'Scoring': {
        [State.SUCCESS]: 'Collecting',
        [State.FAILED]: 'Recycling',
      },
      'Recycling': {},
    }

    return transitions
  }
}

global.ScoreHarvester = ScoreHarvester
