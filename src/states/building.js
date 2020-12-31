'use strict'

global.Building = class extends State {
  findRoom() {
    // prioritize current room
    const rooms = World.territory
    const currentRoom = this.actor.room
    const index = rooms.indexOf(currentRoom)

    if (index > 0) {
      rooms.splice(index, 1)
      rooms.unshift(currentRoom)
    }

    const room = _.find(rooms, 'needsBuilder')

    return room ? room.name : null
  }

  findTarget(room) {
    const target = this.actor.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES)

    return target
  }

  handleAction() {
    const actionResult = new Build(this.actor, this.target).update()

    switch (actionResult) {
      case OK:
      case ERR_BUSY:
      case ERR_NOT_IN_RANGE:
        return State.RUNNING

      case ERR_NOT_ENOUGH_RESOURCES:
        return State.SUCCESS

      case ERR_INVALID_TARGET:
        this.actor.target = null
        this.actor.destination = null
        return State.RUNNING

      case ERR_NOT_OWNER:
      case ERR_NO_BODYPART:
        return State.FAILED

      default:
        console.log('BUILDING', 'unhandled action result', actionResult)
        return State.FAILED
    }
  }

  get validRange() { return 3 }
}
