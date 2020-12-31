'use strict'

class Spawning extends State {
  findRoom() {
    return this.actor.room.name
  }

  findTarget(room) {
    const actor = this.actor

    return actor
  }

  handleAction() {
    if (!this.actor.spawning) { return State.SUCCESS }

    return State.RUNNING
  }

  handleMovement() { return State.RUNNING }
}

global.Spawning = Spawning
