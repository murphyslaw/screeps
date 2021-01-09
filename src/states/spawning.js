'use strict'

class Spawning extends State {
  findRoom() {
    const room = this.actor.room

    return room
  }

  findTarget(room) {
    const actor = this.actor

    return actor
  }

  handleAction() {
    const actor = this.actor

    if (!actor.spawning) { return State.SUCCESS }

    return State.RUNNING
  }

  handleMovement() { return State.RUNNING }
}

global.Spawning = Spawning
