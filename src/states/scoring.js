'use strict'

global.Scoring = class extends State {
  findRoom() {
    return 'W10N30'
  }

  findTarget() {
    return this.room.scoreCollector
  }

  handleAction() {
    const actionResult = new Score(this.actor, this.target).update()

    switch (actionResult) {
      case OK:
        return [State.SUCCESS, actionResult]

      case ERR_BUSY: // -4
      case ERR_NOT_IN_RANGE: // -9
        return [State.RUNNING, actionResult]

      case ERR_FULL: // -8
      case ERR_INVALID_TARGET: // -7
        this.actor.target = null
        return [State.RUNNING, actionResult]

      case ERR_NOT_ENOUGH_RESOURCES: // -6
      case ERR_INVALID_ARGS: // -10
      case ERR_NOT_OWNER: // -1
        return [State.FAILED, actionResult]

      default:
        console.log('SCORING', 'unhandled action result', actionResult)
        return [State.FAILED, actionResult]
    }
  }

  get movementOptions() { return { path: true } }
}
