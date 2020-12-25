'use strict'

class Dismantling extends State {
  findRoom() {
    return 'W20N30'
  }

  findTarget() {
    const target = this.room.scoreCollector.blocker

    return target
  }

  handleAction() {
    const actionResult = new Dismantle(this.actor, this.target).update()

    switch (actionResult) {
      case OK:
      case ERR_BUSY:
      case ERR_NOT_IN_RANGE:
        // check now and then if a better target exists
        if (0 === Game.time % 20) {
          this.actor.target = null
        }

        return [State.RUNNING, actionResult]

      case ERR_INVALID_TARGET:
        this.actor.target = null
        return [State.RUNNING, actionResult]

      case ERR_NO_BODYPART:
      case ERR_NOT_OWNER:
        return [State.FAILED, actionResult]

      default:
        console.log('DEFENDING', 'unhandled action result', actionResult)
        return [State.FAILED, actionResult]
    }
  }
}

global.Dismantling = Dismantling
