'use strict'

global.Move = class extends global.Action {
  constructor(actor, destination) {
    super()

    this.actor = actor
    this.destination = destination
  }

  update() {
    return this.actor.moveTo(this.destination)
  }
}
