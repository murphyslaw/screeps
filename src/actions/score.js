'use strict'

global.Score = class extends global.Action {
  constructor(actor, scoreCollector) {
    super()

    this.actor = actor
    this.scoreCollector = scoreCollector
  }

  update() {
    return this.actor.transfer(this.scoreCollector, RESOURCE_SCORE)
  }
}
