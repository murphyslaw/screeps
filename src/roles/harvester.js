'use strict'

class Harvester extends Role {
  get bodyPattern() { return [WORK, CARRY, MOVE] }
  get maxCreepSize() { return this.bodyPattern.length * 5 }

  get transitions() {
    const transitions = {
      'Spawning': {
        [State.SUCCESS]: 'Harvesting',
      },
      'Harvesting': {
        [State.SUCCESS]: () => {
          const room = this.actor.room
          const controller = room.controller

          if (controller && controller.my && controller.ticksToDowngrade < 2000) return 'Upgrading'
          if (!room.spawns.length) return 'Building'
          if (room.energyAvailable < room.energyCapacityAvailable) return 'Distributing'
          if (room.constructionSites.length) return 'Building'

          return 'Upgrading'
        },
        [State.FAILED]: () => {
          const room = this.actor.room
          if (room.sourceContainers.length) return 'Refilling'

          return 'Idling'
        },
      },
      'Distributing': {
        [State.SUCCESS]: 'Harvesting',
        [State.FAILED]: 'Idling',
      },
      'Upgrading': {
        [State.SUCCESS]: 'Harvesting',
        [State.FAILED]: 'Idling',
      },
      'Building': {
        [State.SUCCESS]: 'Harvesting',
        [State.FAILED]: 'Idling',
      },
      'Refilling': {
        [State.SUCCESS]: 'Distributing',
        [State.FAILED]: 'Idling',
      },
      'Idling': {
        [State.SUCCESS]: 'Harvesting',
        [State.FAILED]: 'Recycling',
      },
      'Recycling': {},
    }

    return transitions
  }
}

global.Harvester = Harvester
