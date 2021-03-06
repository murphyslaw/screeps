'use strict'

class Recycling extends State {
  get icon() { return '💀' }

  findRoom() {
    const room = this.actor.home

    return room
  }

  findTarget(room) {
    return room.spawns[0]
  }

  handleAction() {
    const actor = this.actor
    const target = actor.target

    const actionResult = new Recycle(actor, target).execute()
    // const actionResult = ERR_NOT_IN_RANGE

    switch (actionResult) {
      case OK:
        return State.SUCCESS

      case ERR_NOT_IN_RANGE:
        return State.RUNNING

      case ERR_RCL_NOT_ENOUGH:
      case ERR_INVALID_TARGET:
      case ERR_NO_BODYPART:
      case ERR_NOT_OWNER:
        return State.FAILED

      default:
        console.log('RECYCLING', 'unhandled action result', actionResult)
        return State.FAILED
    }
  }
}

global.Recycling = Recycling
