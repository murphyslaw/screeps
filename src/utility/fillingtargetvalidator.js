'use strict'

class FillingTargetValidator {
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

    let targetUsedCapacity = 0
    let filling = true
    let exclusive = false
    let validTarget = false

    switch (true) {
      case target instanceof Ruin:
      case target instanceof Tombstone:
        targetUsedCapacity = target.store.getUsedCapacity(resource)
        filling = false
        exclusive = true
        break

      case target instanceof ScoreContainer:
        targetUsedCapacity = target.store.getUsedCapacity(resource)
        filling = false
        exclusive = false
        break

      case target instanceof Resource:
        targetUsedCapacity = target.amount
        filling = false
        exclusive = true
        break

      case target instanceof Source:
        if (!SourceValidator.vacancies(actor, target)) return false

        targetUsedCapacity = target.energy
        filling = true
        exclusive = false
        break

      case target instanceof StructureContainer:
        targetUsedCapacity = target.store.getUsedCapacity(resource)
          filling = true
          exclusive = true
          break

      case !_.isUndefined(target.store):
        targetUsedCapacity = target.store.getUsedCapacity(resource)
        filling = true
        exclusive = false
        break

      default:
        break
    }

    if (filling) {
      const actorFreeCapacity = actor.store.getFreeCapacity(resource)
      validTarget = targetUsedCapacity >= actorFreeCapacity
    } else {
      validTarget = targetUsedCapacity > 0
    }

    if (validTarget && exclusive) {
      validTarget = !_.some(World.creeps(actor.role), 'memory.target', target.id)
    }

    return validTarget
  }
}

global.FillingTargetValidator = FillingTargetValidator
