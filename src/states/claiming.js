'use strict'

global.Claiming = class extends State {
  findRoom() {
    return _.find(World.territory, 'needsClaimer').name
  }

  findTarget() {
    const controller = this.room.controller

    if (controller && !controller.owner && !controller.reservation) return controller

    return null
  }

  handleAction() {
    const actionResult = new ClaimController(this.actor, this.target).update()

    switch (actionResult) {
      case OK:
        // remove the claim flag after successfully claiming the room
        this.actor.room.claimFlag.remove()

        return [State.SUCCESS, actionResult]

      case ERR_BUSY:
      case ERR_NOT_IN_RANGE:
        return [State.RUNNING, actionResult]

      case ERR_INVALID_TARGET:
        this.actor.target = null
        return [State.RUNNING, actionResult]

      case ERR_FULL:
      case ERR_NOT_OWNER:
      case ERR_NO_BODYPART:
      case ERR_GCL_NOT_ENOUGH:
        return [State.FAILED, actionResult]

      default:
        console.log('CLAIMING', 'unhandled action result', actionResult)
        return [State.FAILED, actionResult]
    }
  }
}
