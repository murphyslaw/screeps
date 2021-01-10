'use strict'

class Building extends State {
  get icon() { return '🚧' }

  findRoom() {
    const rooms = this.actor.room.prioritize(World.territory)
    const room = _.find(rooms, 'needsBuilder')

    return room
  }

  findTarget(room) {
    const actor = this.actor

    const targets = room.find(FIND_MY_CONSTRUCTION_SITES)
    const target = room !== actor.room ? targets[0] : actor.pos.findClosestByRange(targets)

    return target
  }

  handleAction() {
    const actor = this.actor
    const target = actor.target

    const actionResult = new Build(actor, target).execute()

    switch (actionResult) {
      case OK:
      case ERR_BUSY:
      case ERR_NOT_IN_RANGE:
        return State.RUNNING

      case ERR_NOT_ENOUGH_RESOURCES:
        return State.SUCCESS

      case ERR_INVALID_TARGET:
        actor.target = null
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

global.Building = Building
