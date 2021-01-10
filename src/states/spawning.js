'use strict'

class Spawning extends State {
  handleAction() {
    const actor = this.actor

    if (!actor.spawning) { return State.SUCCESS }

    return State.RUNNING
  }

  handleMovement() { return State.RUNNING }
}

global.Spawning = Spawning
