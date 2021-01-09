'use strict'

class ClaimController extends Action {
  constructor(actor, target) {
    super()

    this.actor = actor
    this.target = target
  }

  execute() {
    return this.actor.claimController(this.target)
  }
}

global.ClaimController = ClaimController
