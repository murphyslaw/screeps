'use strict'

class ContainerExtractor extends Role {
  get bodyPattern() { return [WORK, WORK, WORK, WORK, WORK, MOVE] }

  get number() {
    const number = _.sum(World.territory, function(room) {
      const mineral = room.mineral

      if (!mineral) return 0
      if (mineral.ticksToRegeneration) return 0
      if (!mineral.container) return 0

      return 0
    })

    return number
  }

  get transitions() {
    const transitions = {
      'Spawning': {
        [State.SUCCESS]: 'Extracting',
      },
      'Extracting': {
        [State.SUCCESS]: 'Extracting',
        [State.FAILED]: 'Recycling',
      },
      'Recycling': {}
    }

    return transitions
  }
}

global.ContainerExtractor = ContainerExtractor
