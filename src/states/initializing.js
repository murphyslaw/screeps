'use strict'

global.Initializing = class extends State {
  get state() { return states.INITIALIZING }

  handleTarget() { return State.RUNNING }
  handleMovement() { return State.SUCCESS }

  handleAction() {
    let result = State.RUNNING

    if (!this.actor.spawning) {
      result = State.SUCCESS
    }

    return result
  }
}
