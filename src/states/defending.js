'use strict'

class Defending extends State {
  get icon() { return '🛡️' }

  findRoom() {
    const rooms = World.territory
    const room = _.find(rooms, 'underAttack')

    return room
  }

  findTarget(room) {
    const actor = this.actor

    const targets = room.find(FIND_HOSTILE_CREEPS)
    const target = room !== actor.room ? targets[0] : actor.pos.findClosestByRange(targets)

    return target
  }

  handleAction() {
    const actionResult = new Attack(this.actor, this.target).execute()

    switch (actionResult) {
      case OK:
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
        console.log('DEFENDING', 'unhandled action result', actionResult)
        return State.FAILED
    }
  }
}

global.Defending = Defending
