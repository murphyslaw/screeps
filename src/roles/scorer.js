'use strict'

class Scorer extends Role {
  get bodyPattern() { return [CARRY, MOVE] }
  get maxCreepSize() { return MAX_CREEP_SIZE }
  get resource() { return RESOURCE_SCORE }

  get number() {
    const number = _.some(World.myRooms, room => room.storage && room.storage.store[RESOURCE_SCORE] > 1000) ? 1 : 0

    return number
  }

  findTargetTypes(state) {
    switch (state) {
      case 'Refilling': {
        return [
          FIND_STORAGE,
        ]
      }
    }

    return []
  }

  get transitions() {
    const transitions = {
      'Spawning': {
        [State.SUCCESS]: 'Refilling',
      },
      'Refilling': {
        [State.SUCCESS]: 'Scoring',
        [State.RUNNING]: () => this.actor.target && this.actor.inTargetRoom && this.actor.ticksToLive < 200 ? 'Recycling' : 'Refilling',
        [State.FAILED]: 'Recycling',
      },
      'Scoring': {
        [State.SUCCESS]: () => this.actor.room.scoreContainers.length ? 'Collecting' : 'Refilling',
        [State.FAILED]: 'Idling',
      },
      'Collecting': {
        [State.SUCCESS]: 'Scoring',
        [State.FAILED]: 'Idling',
      },
      'Idling': {
        [State.SUCCESS]: 'Refilling',
        [State.FAILED]: 'Recycling',
      },
      'Recycling': {},
    }

    return transitions
  }
}

global.Scorer = Scorer
