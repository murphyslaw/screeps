'use strict'

class EmptyingTargetValidator {
  constructor(role) {
    this.role = role
    this.actor = role.actor
    this.resource = role.resource
  }

  filter(results) {
    return _.filter(results, this.isValid, this)
  }

  isValid(target) {
    if (!target) return false

    const actor = this.actor
    const resource = this.resource

    let targetFreeCapacity = 0
    let emptying = true
    let exclusive = false
    let validTarget = false

    switch (true) {
      case !_.isUndefined(target.store):
        targetFreeCapacity = target.store.getFreeCapacity(resource)
        emptying = false
        exclusive = false
        break

      case target instanceof RoomPosition:
        validTarget = true
        break
    }

    if (emptying) {
      const actorUsedCapacity = actor.store.getUsedCapacity(resource)
      validTarget = targetFreeCapacity >= actorUsedCapacity
    } else {
      validTarget = targetFreeCapacity > 0
    }

    if (validTarget && exclusive) {
      validTarget = !_.some(World.creeps(actor.role.name, actor), 'memory.target', target.id)
    }

    return validTarget
  }
}

global.EmptyingTargetValidator = EmptyingTargetValidator
