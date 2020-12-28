'use strict'

class Upgrading extends State {
  findRoom() {
    const room = _.min(World.myRooms, function (myRoom) {
      let count = myRoom.creeps('Upgrader').length

      // don't count the searching creep
      if (this.actor.room === myRoom) count -= 1

      return count
    }, this)

    return room.name
  }

  findTarget() {
    return this.room.controller
  }

  handleAction() {
    let actionResult = new UpgradeController(this.actor, this.target).update()

    switch (actionResult) {
      case OK:
      case ERR_NOT_ENOUGH_RESOURCES:
        if (0 === this.actor.store.getUsedCapacity(RESOURCE_ENERGY)) {
          return State.SUCCESS
        } else {
          return State.RUNNING
        }

      case ERR_BUSY:
      case ERR_NOT_IN_RANGE:
        return State.RUNNING

      case ERR_INVALID_TARGET:
        this.actor.target = null
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
