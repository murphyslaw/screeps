'use strict'

class Idling extends State {
  handleTarget() { return [State.RUNNING, OK] }

  handleAction() {
    if (Game.time % 5 === 0) return [State.SUCCESS, OK]

    const actionResult = new Say(this.actor, '💤').update()

    switch (actionResult) {
      case OK:
      case ERR_BUSY:
        return [State.RUNNING, actionResult]

      case ERR_NOT_OWNER:
        return [State.FAILED, actionResult]

      default:
        console.log('IDLING', 'unhandled action result', actionResult)
        return [State.FAILED, actionResult]
    }
  }

  handleMovement() { return [State.RUNNING, OK] }
}

global.Idling = Idling
