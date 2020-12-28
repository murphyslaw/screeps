'use strict'

class Withdraw extends Action {
  constructor(actor, target, resource) {
    super()

    this.actor = actor
    this.target = target
    this.resource = resource
  }

  update() {
    return this.actor.withdraw(this.target, this.resource)
  }
}

global.Withdraw = Withdraw
