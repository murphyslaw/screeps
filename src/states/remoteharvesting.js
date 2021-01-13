'use strict'

class RemoteHarvesting extends State {
  get icon() { return '🛢︎' }
  get validator() { return new FillingTargetValidator(this.role) }

  findRoom() {
    const actor = this.actor
    const rooms = actor.room.prioritize(actor.home.remotes)
    const targetFinder = this.targetFinder
    const targetTypes = this.targetTypes

    const room = _.find(rooms, function (room) {
      const targets = targetFinder.find(room, targetTypes)

      return targets.length > 0
    }, this)

    return room
  }

  findTarget(room) {
    const actor = this.actor

    const targets = this.targetFinder.find(room, this.targetTypes)
    const target = room !== actor.room ? targets[0] : actor.pos.findClosestByRange(targets)

    return target
  }

  get targetTypes() {
    const targetTypes = [
      FIND_SOURCES_ACTIVE,
    ]

    return targetTypes
  }

  handleAction() {
    const actor = this.actor
    const target = actor.target
    const resource = this.role.resource

    const actionResult = new Harvest(actor, target).execute()

    switch (actionResult) {
      case OK:
        if (0 === actor.store.getFreeCapacity(resource)) {
          return State.SUCCESS
        } else {
          return State.RUNNING
        }

      case ERR_BUSY:
      case ERR_NOT_IN_RANGE:
      case ERR_TIRED:
        return State.RUNNING

      case ERR_NOT_ENOUGH_RESOURCES:
      case ERR_INVALID_TARGET:
        this.changeTarget(actor, null)
        return State.RUNNING

      case ERR_NOT_FOUND:
      case ERR_NO_BODYPART:
      case ERR_NOT_OWNER:
        return State.FAILED

      default:
        console.log('REMOTEHARVESTING', 'unhandled action result', actionResult)
        return State.FAILED
    }
  }
}

global.RemoteHarvesting = RemoteHarvesting
