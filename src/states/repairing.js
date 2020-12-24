'use strict'

class Repairing extends State {
  findRoom() {
    const room = _.sample(_.filter(World.territory, 'needsRepairer'))

    return room ? room.name : null
  }

  validateTarget(target) {
    return target && target.hits < target.hitsMax ? target : null
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
        return [State.RUNNING, actionResult]

      case ERR_NOT_ENOUGH_RESOURCES:
        return [State.SUCCESS, actionResult]

      case ERR_INVALID_TARGET:
        this.actor.target = null
        return [State.RUNNING, actionResult]

      case ERR_NOT_OWNER:
      case ERR_NO_BODYPART:
        return [State.FAILED, actionResult]

      default:
        console.log('REPAIRING', 'unhandled action result', actionResult)
        return [State.FAILED, actionResult]
    }
  }

  get validRange() { return 3 }
}

global.Repairing = Repairing
