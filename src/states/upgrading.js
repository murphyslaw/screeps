'use strict'

class Upgrading extends State {
  get icon() { return '➕' }

  findRoom() {
    const room = _.min(World.myRooms, function (myRoom) {
      let count = myRoom.creeps('Upgrader').length

      // don't count the searching creep
      if (this.actor.room === myRoom) count -= 1

      return count
    }, this)

    return room
  }

  findTarget(room) {
    const target = room.controller

    return target
  }

  handleAction() {
    const actor = this.actor
    const target = actor.target

    let actionResult = new UpgradeController(actor, target).execute()

    switch (actionResult) {
      case OK:
      case ERR_NOT_ENOUGH_RESOURCES:
        if (0 === actor.store.getUsedCapacity(RESOURCE_ENERGY)) {
          return State.SUCCESS
        } else {
          return State.RUNNING
        }

      case ERR_BUSY:
      case ERR_NOT_IN_RANGE:
        return State.RUNNING

      case ERR_INVALID_TARGET:
        actor.target = null
        return State.RUNNING

      case ERR_NO_BODYPART:
      case ERR_NOT_OWNER:
        return State.FAILED

      default:
        console.log('UPGRADING', 'unhandled action result', actionResult)
        return State.FAILED
    }
  }

  get validRange() { return 3 }
}

global.Upgrading = Upgrading
