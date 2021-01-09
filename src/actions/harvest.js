'use strict'

class Harvest extends Action {
  constructor(actor, target) {
    super()

    this.actor = actor
    this.target = target
  }

  execute() {
    return this.actor.harvest(this.target)
  }
}

global.Harvest = Harvest
