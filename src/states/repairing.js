'use strict'

class Repairing extends State {
  get icon() { return '🛠' }
  get validator() { return new DamagedTargetValidator(this.role) }

  findRoom() {
    const room = _.sample(_.filter(World.territory, 'needsRepairer'))

    return room
  }

  get targetTypes() {
    const targetTypes = [
      FIND_UTILITY_STRUCTURES,
    ]

    return targetTypes
  }

  findTarget(room) {
    const actor = this.actor

    const targets = this.targetFinder.find(room, this.targetTypes)
    const target = room !== actor.room ? targets[0] : actor.pos.findClosestByRange(targets)

    return target
  }

  handleAction() {
    const actor = this.actor
    const target = actor.target

    let actionResult = new Repair(actor, target).execute()

    switch (actionResult) {
      case OK:
      case ERR_BUSY:
      case ERR_NOT_IN_RANGE:
        return State.RUNNING

      case ERR_NOT_ENOUGH_RESOURCES:
        return State.SUCCESS

      case ERR_INVALID_TARGET:
        this.changeTarget(actor, null)
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
