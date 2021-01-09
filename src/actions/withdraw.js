'use strict'

class Withdraw extends Action {
  constructor(actor, target, resource) {
    super()

    this.actor = actor
    this.target = target
    this.resource = resource
  }

  execute() {
    const actor = this.actor
    const target = this.target
    const resource = this.resource

    const actionResult = actor.withdraw(target, resource)

    return actionResult
  }
}

global.Withdraw = Withdraw
