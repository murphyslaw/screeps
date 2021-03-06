'use strict'

class Extracting extends State {
  get icon() { return '🛢︎' }
  get validator() { return new FillingTargetValidator(this.role) }

  findRoom() {
    const actor = this.actor

    // prioritize current target
    const target = actor.target
    if (target) return target.room.name

    const rooms = actor.room.prioritize(actor.home.territory)

    const room = _.find(rooms, function(room) {
      const mineral = room.mineral

      if (!mineral) return false

      return !mineral.ticksToRegeneration &&
        mineral.container &&
        !_.some(World.creeps('ContainerExtractor'), 'memory.target', mineral.id)
    })

    return room
  }

  findTarget(room) {
    const mineral = room.mineral

    if (!mineral) return null
    if (!mineral.container) return null
    if (_.some(World.creeps('ContainerHarvester'), 'memory.target', mineral.id)) return null

    return mineral
  }

  handleAction() {
    const actor = this.actor
    const target = actor.target

    const actionResult = new Harvest(actor, target).execute()

    switch (actionResult) {
      case OK:
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
        console.log('EXTRACTING', 'unhandled action result', actionResult)
        return State.FAILED
    }
  }

  targetBasedDestination(target) {
    if (!target) return target

    return target.container
  }

  validRange() {
    return 0
  }
}

global.Extracting = Extracting
