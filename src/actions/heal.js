'use strict'

global.Heal = class extends global.Action {
  constructor(actor, target) {
    super()

    this.actor = actor
    this.target = target
  }

  execute() {
    return this.actor.heal(this.target)
  }
}
