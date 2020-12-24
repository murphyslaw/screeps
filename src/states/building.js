'use strict'

global.Building = class extends State {
  findRoom() {
    return _.find(World.territory, 'needsBuilder').name
  }

  findTarget() {
    return this.actor.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES)
  }

  handleAction() {
    const actionResult = new Build(this.actor, this.target).update()

    switch (actionResult) {
      case OK:
      case ERR_BUSY:
      case ERR_NOT_IN_RANGE:
        return [State.RUNNING, actionResult]

      case ERR_NOT_ENOUGH_RESOURCES:
        return [State.SUCCESS, actionResult]

      case ERR_INVALID_TARGET:
        this.actor.target = null
        return [State.RUNNING, actionResult]

      case ERR_NOT_OWNER:
      case ERR_NO_BODYPART:
        return [State.FAILED, actionResult]

      default:
        console.log('BUILDING', 'unhandled action result', actionResult)
        return [State.FAILED, actionResult]
    }
  }
}
