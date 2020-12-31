'use strict'

global.Claiming = class extends State {
  findRoom() {
    return _.find(World.territory, 'needsClaimer').name
  }

  findTarget(room) {
    const controller = room.controller

    if (controller && !controller.owner && !controller.reservation) return controller

    return null
  }

  handleAction() {
    const actionResult = new ClaimController(this.actor, this.target).update()

    switch (actionResult) {
      case OK:
        // remove the claim flag after successfully claiming the room
        this.actor.room.claimFlag.remove()

        return State.SUCCESS

      case ERR_BUSY:
      case ERR_NOT_IN_RANGE:
        return State.RUNNING

      case ERR_INVALID_TARGET:
        this.actor.target = null
        return State.RUNNING

      case ERR_FULL:
      case ERR_NOT_OWNER:
      case ERR_NO_BODYPART:
      case ERR_GCL_NOT_ENOUGH:
        return State.FAILED

      default:
        console.log('CLAIMING', 'unhandled action result', actionResult)
        return State.FAILED
    }
  }
}
