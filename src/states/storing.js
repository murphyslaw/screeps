'use strict'

class Storing extends State {
  get icon() { return '🚚' }
  get validator() { return new EmptyingTargetValidator(this.role) }

  findRoom() {
    const actor = this.actor
    const targetFinder = this.targetFinder
    const targetTypes = this.targetTypes

    const targets = targetFinder.find(actor.home, targetTypes)

    return targets.length > 0 ? actor.home : null
  }

  get targetTypes() {
    const targetTypes = [
      FIND_STORAGE,
    ]

    return targetTypes
  }

  findTarget(room) {
    const actor = this.actor
    const targetFinder = this.targetFinder

    const targets = targetFinder.find(room, this.targetTypes)
    const target = room !== actor.room ? targets[0] : actor.pos.findClosestByRange(targets)

    return target
  }

  handleAction() {
    const actor = this.actor
    const target = actor.target
    const carriedResourceTypes = actor.store.resources
    const resourceType = this.role.resource || _.first(carriedResourceTypes)

    const actionResult = new Transfer(actor, target, resourceType).execute()

    switch (actionResult) {
      case OK:
        if (carriedResourceTypes.length > 1) {
          return State.RUNNING
        } else {
          return State.SUCCESS
        }

      case ERR_NOT_ENOUGH_RESOURCES:
        return State.SUCCESS

      case ERR_BUSY:
      case ERR_NOT_IN_RANGE:
        return State.RUNNING

      case ERR_FULL:
      case ERR_INVALID_TARGET:
        actor.target = null
        return State.RUNNING

      case ERR_INVALID_ARGS:
      case ERR_NO_BODYPART:
      case ERR_NOT_OWNER:
        return State.FAILED

      default:
        console.log('STORING', 'unhandled action result', actionResult)
        return State.FAILED
    }
  }
}

global.Storing = Storing
