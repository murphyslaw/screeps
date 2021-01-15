'use strict'

class Claiming extends State {
  findRoom() {
    const rooms = World.knownRooms
    const room = _.find(rooms, 'needsClaimer')

    return room
  }

  findTarget(room) {
    const controller = room.controller

    if (controller && !controller.owner && (!controller.reservation || controller.reserved)) return controller

    return null
  }

  handleAction() {
    const actor = this.actor
    const target = this.actor.target

    const actionResult = new ClaimController(actor, target).execute()

    switch (actionResult) {
      case OK:
        // remove the claim flag after successfully claiming the room
        actor.room.claimFlag.remove()

        return State.SUCCESS

      case ERR_BUSY:
      case ERR_NOT_IN_RANGE:
        return State.RUNNING

      case ERR_INVALID_TARGET:
        actor.target = null
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

global.Claiming = Claiming
