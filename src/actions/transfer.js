'use strict'

class Transfer extends Action {
  constructor(actor, target, resourceType) {
    super()

    this.actor = actor
    this.target = target
    this.resourceType = resourceType
  }

  update() {
    return this.actor.transfer(this.target, this.resourceType)
  }
}

global.Transfer = Transfer
