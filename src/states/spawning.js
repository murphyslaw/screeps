'use strict'

class Spawning extends State {
  handleTarget() { return [State.RUNNING, OK] }

  handleAction() {
    if (!this.actor.spawning) { return [State.SUCCESS, OK] }

    return [State.RUNNING, OK]
  }

  handleMovement() { return [State.RUNNING, OK] }
}

global.Spawning = Spawning
