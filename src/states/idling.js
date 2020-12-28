'use strict'

class Idling extends State {
  handleAction() {
    if (Game.time % 5 === 0) return State.SUCCESS

    let actionResult

    actionResult = new Say(this.actor, '💤').update()

    switch (actionResult) {
      case OK:
      case ERR_BUSY:
        return State.RUNNING

      case ERR_NOT_OWNER:
        return State.FAILED
    }

    actionResult = new RandomMove(this.actor).update()

    switch (actionResult) {
      case OK:
      case ERR_BUSY:
      case ERR_NOT_IN_RANGE:
      case ERR_TIRED:
        return State.RUNNING

      case ERR_INVALID_ARGS:
      case ERR_NOT_OWNER:
      case ERR_NO_BODYPART:
        return State.FAILED
    }

    return State.RUNNING
  }

  handleMovement() { return State.RUNNING }
}

global.Idling = Idling
