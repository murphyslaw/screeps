'use strict'

class ContainerHarvester extends Role {
  get bodyPattern() { return [WORK, WORK, WORK, WORK, WORK, MOVE] }

  get number() {
    const number = _.sum(World.territory, room => room.sourceContainers.length)
    return number
  }

  get transitions() {
    const transitions = {
      'Spawning': {
        [State.SUCCESS]: 'Harvesting',
      },
      'Harvesting': {
        [State.SUCCESS]: 'Harvesting',
        [State.FAILED]: 'Recycling',
      },
      'Recycling': {},
    }

    return transitions
  }
}

global.ContainerHarvester = ContainerHarvester
