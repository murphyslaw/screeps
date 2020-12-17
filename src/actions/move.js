'use strict'

global.Move = class extends global.Action {
  constructor(actor, target) {
    super()

    this.actor = actor
    this.target = target
  }

  update() {
    console.log(this.actor, 'moves to', this.target)

    return this.actor.moveTo(this.target)
  }
}
