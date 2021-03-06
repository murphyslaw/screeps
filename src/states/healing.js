'use strict'

class Healing extends State {
  findRoom() {
    return this.actor.room
  }

  findTarget(room) {
    const actor = this.actor

    return actor
  }

  handleAction() {
    let result = State.SUCCESS

    const actionResult = new Heal(this.actor, this.target).execute()

    switch (actionResult) {
      case OK:
        result = State.RUNNING
        break
      default:
        result = State.FAILED
        break
    }

    if (!this.actor.wounded) {
      result = State.SUCCESS
    }

    return result
  }
}

global.Healing = Healing
