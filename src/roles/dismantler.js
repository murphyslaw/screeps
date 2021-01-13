'use strict'

class Dismantler extends Role {
  get bodyPattern() {
    return [
      WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
      WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
      WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE,
      MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
      MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
    ]
  }
  get maxCreepSize() { return MAX_CREEP_SIZE }
  get maxSpawnTime() {
    // TODO: calculate distance to target dynamically
    return (this.maxCreepSize * CREEP_SPAWN_TIME) + 215
  }

  get transitions() {
    const transitions = {
      'Spawning': {
        [State.SUCCESS]: 'Dismantling',
      },
      'Dismantling': {},
      'Recycling': {},
    }

    return transitions
  }
}

global.Dismantler = Dismantler
