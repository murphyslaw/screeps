'use strict'

class ContainerExtractor extends Role {
  get bodyPattern() { return [WORK, WORK, WORK, WORK, WORK, MOVE] }

  get number() {
    const number = _.sum(World.territory, function(room) {
      const mineral = _.first(room.minerals)

      if (mineral && !mineral.ticksToRegeneration) {
        return room.mineralContainers.length
      } else {
        return 0
      }
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
