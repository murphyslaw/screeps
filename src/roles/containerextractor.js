'use strict'

class ContainerExtractor extends Role {
  get bodyPattern() { return [WORK, WORK, WORK, WORK, WORK, MOVE] }

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
