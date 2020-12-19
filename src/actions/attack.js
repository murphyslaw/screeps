'use strict'

global.Attack = class extends global.Action {
  constructor(actor, target) {
    super()

    this.actor = actor
    this.target = target
  }

  update() {
    return this.actor.attack(this.target)
  }
}
