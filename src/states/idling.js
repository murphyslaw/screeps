'use strict'

class Idling extends State {
  get icon() { return '💤' }

  handleAction() {
    if (Game.time % 5 === 0) return State.SUCCESS

    new Say(this.actor, '💤').execute()

    return State.RUNNING
  }

  handleMovement() {
    const actionResult = new RandomMove(this.actor).execute()

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
}

global.Idling = Idling
