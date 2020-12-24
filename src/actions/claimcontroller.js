'use strict'

global.ClaimController = class extends Action {
  constructor(actor, target) {
    super()

    this.actor = actor
    this.target = target
  }

  update() {
    return this.actor.claimController(this.target)
  }
}
