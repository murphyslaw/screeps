'use strict'

class Dismantler extends Creepy {
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

  number(room) { return 1 }

  nextState(context) {
    const actor = this.actor
    const result = context.result
    const state = context.currentState
    let nextState = context.currentState

    switch (state) {
      case 'Spawning':
        if (State.SUCCESS === result) {
          nextState = 'Dismantling'
        }

        break
      case 'Dismantling':
        break
      case 'Recycling':
        break
      default:
        console.log('DISMANTLER', 'unhandled state', state, JSON.stringify(context))
        break
    }

    return nextState
  }
}

global.Dismantler = Dismantler
