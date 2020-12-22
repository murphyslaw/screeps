'use strict'

global.Healing = class extends State {
  get state() { return states.HEALING }

  findRoom() {
    return this.actor.room
  }

  findTarget() {
    return this.actor
  }

  handleAction() {
    let result = State.SUCCESS

    const actionResult = new Heal(this.actor, this.target).update()

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
