'use strict'

class Repair extends Action {
  constructor(actor, target) {
    super()

    this.actor = actor
    this.target = target
  }

  execute() {
    return this.actor.repair(this.target)
  }
}

global.Repair = Repair
