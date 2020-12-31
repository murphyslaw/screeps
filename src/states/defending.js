'use strict'

global.Defending = class extends State {
  get icon() { return '🛡️' }

  findRoom() {
    const room = _.find(World.territory, 'underAttack')

    return room ? room.name : null
  }

  findTarget(room) {
    return this.actor.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
  }

  handleAction() {
    const actionResult = new Attack(this.actor, this.target).update()

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
