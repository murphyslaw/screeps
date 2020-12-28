'use strict'

class Repairing extends State {
  findRoom() {
    const room = _.sample(_.filter(World.territory, 'needsRepairer'))

    return room ? room.name : null
  }

  validTarget(target) {
    if (!target) return false

    return target.hits < target.hitsMax
  }

  findTarget() {
    const target = this.actor.pos.findClosestByRange(this.room.damagedStructures)

    return target
  }

  handleAction() {
    let actionResult = new Repair(this.actor, this.target).update()

    switch (actionResult) {
      case OK:
      case ERR_BUSY:
      case ERR_NOT_IN_RANGE:
        return State.RUNNING

      case ERR_NOT_ENOUGH_RESOURCES:
        return State.SUCCESS

      case ERR_INVALID_TARGET:
        this.actor.target = null
        return State.RUNNING

      case ERR_NOT_OWNER:
      case ERR_NO_BODYPART:
        return State.FAILED

      default:
        console.log('REPAIRING', 'unhandled action result', actionResult)
        return State.FAILED
    }
  }

  get validRange() { return 3 }
}

global.Repairing = Repairing
