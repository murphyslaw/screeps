'use strict'

class UpgradeController extends Action {
  constructor(actor, target) {
    super()

    this.actor = actor
    this.target = target
  }

  update() {
    return this.actor.upgradeController(this.target)
  }
}

global.UpgradeController = UpgradeController
