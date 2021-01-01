'use strict'

class ContainerExtractor extends Role {
  get bodyPattern() { return [WORK, WORK, WORK, WORK, WORK, MOVE] }

  number(room) {
    const mineral = room.mineral

    if (!mineral) { return 0 }
    if (!mineral.container) { return 0 }
    if (!mineral.extractor) { return 0 }
    if (mineral.ticksToRegeneration) { return 0 }
    if (_.some(World.creeps('ContainerExtractor'), 'memory.source', mineral.id)) { return 0 }

    return 1
  }

  nextState(context) {
    const actor = this.actor
    const result = context.result
    const currentState = context.currentState
    let nextState = context.currentState

    switch (currentState) {
      case 'Spawning':
        if (!actor.spawning) {
          nextState = 'Extracting'
          break
        }

        break
      case 'Extracting':
        if (State.SUCCESS === result) {
          nextState = 'Extracting'
          break
        }

        if (State.FAILED === result) {
          nextState = 'Recycling'
          break
        }

        break
      case 'Recycling':
        break
      default:
        console.log('CONTAINEREXTRACTOR', 'unhandled state', currentState, JSON.stringify(context))
        break
    }

    return nextState
  }
}

global.ContainerExtractor = ContainerExtractor
