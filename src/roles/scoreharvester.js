'use strict'

class ScoreHarvester extends Creepy {
  get bodyPattern() { return [CARRY, MOVE] }
  get maxCreepSize() { return this.bodyPattern.length * 6 }
  get resource() { return RESOURCE_SCORE }

  number(room) {
    const needsScoreHarvester = _.some(World.territory, 'needsScoreHarvester')

    return needsScoreHarvester ? 2 : 0
  }

  nextState(context) {
    const actor = this.actor
    const result = context.result
    const currentState = context.currentState
    let nextState = context.currentState

    switch (currentState) {
      case 'Spawning':
        if (!actor.spawning) {
          nextState = 'Collecting'
          break
        }

        break
      case 'Collecting':
        if (State.SUCCESS === result) {
          nextState = 'Storing'
          break
        }

        if (State.FAILED === result) {
          nextState = 'Recycling'
          break
        }

        break
      case 'Storing':
        if (State.SUCCESS === result) {
          nextState = 'Collecting'
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
        console.log('SCOREHARVESTER', 'unhandled state', currentState, JSON.stringify(context))
        break
    }

    return nextState
  }
}

global.ScoreHarvester = ScoreHarvester
