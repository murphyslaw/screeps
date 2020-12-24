'use strict'

class ScoreHarvester extends Creepy {
  get bodyPattern() { return [CARRY, MOVE] }
  get maxCreepSize() { return this.bodyPattern.length * 6 }

  number(room) {
    const needsScoreHarvester = _.some(World.territory, 'needsScoreHarvester')

    return needsScoreHarvester ? 2 : 0
  }

  nextState(context) {
    const actor = context.actor
    const result = context.result
    const currentState = context.currentState
    let nextState = context.currentState

    switch (currentState) {
      case states.INITIALIZING:
        if (!actor.spawning) {
          nextState = states.COLLECTING
          break
        }

        break
      case states.COLLECTING:
        if (State.SUCCESS === result) {
          nextState = states.STORING
          break
        }

        if (State.FAILED === result) {
          nextState = states.RECYCLING
          break
        }

        break
      case states.STORING:
        if (State.SUCCESS === result) {
          nextState = states.COLLECTING
          break
        }

        if (State.FAILED === result) {
          nextState = states.RECYCLING
          break
        }

        break
      case states.RECYCLING:
        break
      default:
        console.log('SCOREHARVESTER', 'unhandled state', currentState, JSON.stringify(context))
        break
    }

    return nextState
  }
}

global.ScoreHarvester = ScoreHarvester
