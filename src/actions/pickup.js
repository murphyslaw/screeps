'use strict'

class Pickup extends Action {
  constructor(actor, target) {
    super()

    this.actor = actor
    this.target = target
  }

  execute() {
    return this.actor.pickup(this.target)
  }
}

global.Pickup = Pickup
