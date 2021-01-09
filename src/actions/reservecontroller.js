'use strict'

class ReserveController extends Action {
  constructor(actor, target) {
    super()

    this.actor = actor
    this.target = target
  }

  execute() {
    const actor = this.actor
    const target = this.target

    return actor.reserveController(target)
  }
}

global.ReserveController = ReserveController
