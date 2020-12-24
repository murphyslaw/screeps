'use strict'

global.Build = class extends Action {
  constructor(actor, target) {
    super()

    this.actor = actor
    this.target = target
  }

  update() {
    return this.actor.build(this.target)
  }
}
