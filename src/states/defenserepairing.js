'use strict'

class DefenseRepairing extends State {
  get icon() { return '🛠' }
  get validator() { return new DamagedTargetValidator(this.role) }

  findRoom() {
    const actor = this.actor
    const rooms = actor.room.prioritize(World.territory)

    const room = _.find(rooms, function (room) {
      const targets = this.targetFinder.find(room, this.targetTypes)

      return targets.length > 0
    }, this)

    return room
  }

  get targetTypes() {
    const targetTypes = [
      FIND_DEFENSES,
    ]

    return targetTypes
  }

  findTarget(room) {
    const targets = this.targetFinder.find(room, this.targetTypes)
    const target = _.first(targets.sort((a, b) => a.hits - b.hits))

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
        console.log('DEFENSEREPAIRING', 'unhandled action result', actionResult)
        return State.FAILED
    }
  }

  get validRange() { return 3 }
}

global.DefenseRepairing = DefenseRepairing
