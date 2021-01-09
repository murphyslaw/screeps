'use strict'

class Collecting extends State {
  get icon() { return '🏆' }
  get validator() { return new FillingTargetValidator(this.role) }

  findRoom() {
    const rooms = this.actor.room.prioritize(World.knownRooms)
    const room = _.find(rooms, 'needsScoreHarvester')

    return room
  }

  findTarget(room) {
    const scoreContainers = room.scoreContainers

    return scoreContainers.length ? scoreContainers[0] : null
  }

  handleAction() {
    const actor = this.actor
    const target = actor.target
    const resource = this.role.resource

    const actionResult = new Withdraw(actor, target, resource).execute()

    switch (actionResult) {
      case OK:
      case ERR_FULL:
        return State.SUCCESS

      case ERR_BUSY:
      case ERR_NOT_IN_RANGE:
        return State.RUNNING

      case ERR_NOT_ENOUGH_RESOURCES:
      case ERR_INVALID_TARGET:
        this.changeTarget(actor, null)
        return State.RUNNING

      case ERR_INVALID_ARGS:
      case ERR_NO_BODYPART:
      case ERR_NOT_OWNER:
        return State.FAILED

      default:
        console.log('COLLECTING', 'unhandled action result', actionResult)
        return State.FAILED
    }
  }
}

global.Collecting = Collecting
