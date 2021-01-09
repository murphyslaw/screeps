'use strict'

class Reserving extends State {
  findRoom() {
    const rooms = World.territory
    const room = _.find(rooms, 'needsReserver')

    return room
  }

  findTarget(room) {
    const controller = room.controller

    if (controller && !controller.owner) return controller

    return null
  }

  handleAction() {
    const actor = this.actor
    const target = this.actor.target

    const actionResult = new ReserveController(actor, target).execute()

    switch (actionResult) {
      case OK:
        return State.RUNNING

      case ERR_BUSY:
      case ERR_NOT_IN_RANGE:
        return State.RUNNING

      case ERR_INVALID_TARGET:
        actor.target = null
        return State.RUNNING

      case ERR_NOT_OWNER:
      case ERR_NO_BODYPART:
        return State.FAILED

      default:
        console.log('RESERVING', 'unhandled action result', actionResult)
        return State.FAILED
    }
  }
}

global.Reserving = Reserving
