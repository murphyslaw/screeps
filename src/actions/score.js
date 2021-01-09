'use strict'

class Score extends Action {
  constructor(actor, scoreCollector) {
    super()

    this.actor = actor
    this.scoreCollector = scoreCollector
  }

  execute() {
    const actor = this.actor
    const scoreCollector = this.scoreCollector

    return actor.transfer(scoreCollector, RESOURCE_SCORE)
  }
}

global.Score = Score
