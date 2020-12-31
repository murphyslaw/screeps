'use strict'

class DefenseRepairing extends State {
  get icon() { return '🛠' }
  get validator() { return new DamagedTargetValidator(this.role) }

  findRoom() {
    const room = this.actor.room

    return room && room.name
  }

  findTarget(room) {
    let damagedDefenses = room.damagedDefenses

    const towers = _.filter(damagedDefenses, function (structure) {
      return structure.structureType == STRUCTURE_TOWER &&
        !_.some(Game.creeps, 'target', structure)
    })

    if (towers.length) {
      towers = towers.sort((a, b) => a.hits - b.hits)

      return towers[0]
    }

    let structures = []

    if (!structures.length) {
      structures = _.filter(damagedDefenses, function (structure) {
        return !_.some(Game.creeps, 'target', structure)
      }, this)
    }

    structures = structures.sort((a, b) => a.hits - b.hits)

    return structures[0]
  }

  handleAction() {
    const actor = this.actor
    const target = actor.target

    let actionResult = new Repair(actor, target).update()

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
