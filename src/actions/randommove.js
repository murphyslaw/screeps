'use strict'

class RandomMove extends Action {
  constructor(actor) {
    super()

    this.actor = actor
  }

  execute() {
    return this.actor.move(this.randomDirection)
  }

  get randomDirection() {
    return _.sample(global.DIRECTIONS)
  }
}

global.RandomMove = RandomMove
