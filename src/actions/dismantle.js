'use strict'

global.Dismantle = class extends global.Action {
  constructor(actor, target) {
    super()

    this.actor = actor
    this.target = target
  }

  update() {
    return this.actor.dismantle(this.target)
  }
}
