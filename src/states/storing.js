'use strict'

class Storing extends State {
  get icon() { return '🚚' }
  get validator() { return new EmptyingTargetValidator(this.role) }

  findRoom() {
    const rooms = this.actor.room.prioritize(World.myRooms)
    const room = _.find(rooms, room => this.validator.isValid(room.storage))

    return room ? room.name : null
  }

  findTarget(room) {
    const targetTypes = [
      FIND_STORAGE,
    ]

    const targets = this.targetFinder.find(room, targetTypes)

    return this.actor.pos.findClosestByRange(targets)
  }

  handleAction() {
    const actor = this.actor
    const target = actor.target
    const resource = this.role.resource

    const actionResult = new Transfer(actor, target, resource).update()

    switch (actionResult) {
      case OK:
      case ERR_NOT_ENOUGH_RESOURCES:
        return State.SUCCESS

      case ERR_BUSY:
      case ERR_NOT_IN_RANGE:
        return State.RUNNING

      case ERR_FULL:
      case ERR_INVALID_TARGET:
        actor.target = null
        return State.RUNNING

      case ERR_INVALID_ARGS:
      case ERR_NO_BODYPART:
      case ERR_NOT_OWNER:
        return State.FAILED

      default:
        console.log('STORING', 'unhandled action result', actionResult)
        return State.FAILED
    }
  }
}

global.Storing = Storing
