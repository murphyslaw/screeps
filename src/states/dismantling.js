'use strict'

class Dismantling extends State {
  findRoom() {
    const room = World.getRoom('W20N30')

    return room
  }

  findTarget(room) {
    let scoreCollector = room.scoreCollector

    return scoreCollector ? scoreCollector.blocker : null
  }

  handleAction() {
    const actionResult = new Dismantle(this.actor, this.target).execute()

    switch (actionResult) {
      case OK:
      case ERR_BUSY:
      case ERR_NOT_IN_RANGE:
        // check now and then if a better target exists
        if (0 === Game.time % 20) {
          this.actor.target = null
        }

        return State.RUNNING

      case ERR_INVALID_TARGET:
        this.actor.target = null
        return State.RUNNING

      case ERR_NO_BODYPART:
      case ERR_NOT_OWNER:
        return State.FAILED

      default:
        console.log('DEFENDING', 'unhandled action result', actionResult)
        return State.FAILED
    }
  }
}

global.Dismantling = Dismantling
