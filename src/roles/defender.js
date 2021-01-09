'use strict'

class Defender extends Role {
  get bodyPattern() { return [TOUGH, TOUGH, ATTACK, ATTACK, MOVE, MOVE] }
  get maxCreepSize() { return this.bodyPattern.length * 4 }

  get number() {
    const underAttack = _.some(World.territory, 'underAttack')

    return underAttack ? 1 : 0
  }

  get transitions() {
    const transitions = {
      'Spawning': {
        [State.SUCCESS]: 'Defending',
      },
      'Defending': {
        [State.SUCCESS]: 'Recycling',
        [State.FAILED]: 'Recycling',
      },
      'Recycling': {},
    }

    return transitions
  }
}

global.Defender = Defender
