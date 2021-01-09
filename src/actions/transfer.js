'use strict'

class Transfer extends Action {
  constructor(actor, target, resourceType) {
    super()

    this.actor = actor
    this.target = target
    this.resourceType = resourceType
  }

  execute() {
    const actor = this.actor
    const target = this.target
    const resourceType = this.resourceType

    const actionResult = actor.transfer(target, resourceType)

    return actionResult
  }
}

global.Transfer = Transfer
