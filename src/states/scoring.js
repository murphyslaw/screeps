'use strict'

global.Scoring = class extends State {
  findRoom() {
    return 'W10N30'
  }

  findTarget(room) {
    return room.scoreCollector
  }

  handleAction() {
    const actionResult = new Score(this.actor, this.target).update()

    switch (actionResult) {
      case OK:
        return State.SUCCESS

      case ERR_BUSY:
      case ERR_NOT_IN_RANGE:
        return State.RUNNING

      case ERR_FULL:
      case ERR_INVALID_TARGET:
        this.actor.target = null
        return State.RUNNING

      case ERR_NOT_ENOUGH_RESOURCES:
      case ERR_INVALID_ARGS:
      case ERR_NOT_OWNER:
        return State.FAILED

      default:
        console.log('SCORING', 'unhandled action result', actionResult)
        return State.FAILED
    }
  }

  get movementOptions() { return { path: true } }
}
