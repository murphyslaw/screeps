'use strict'

class TargetFinder {
  constructor(validator) {
    this.validator = validator
  }

  find(room, targetTypes) {
    let targets = []

    if (targetTypes[0] instanceof Array) {
      _.some(targetTypes, function (targetType) {
        targets = this.findByTargetTypes(room, targetType)

        if (targets.length) return true
      }, this)
    } else {
      targets = this.findByTargetTypes(room, targetTypes)
    }

    return targets
  }

  findByTargetTypes(room, targetTypes) {
    // TODO: this was an emergency fix...not sure if it is the best place
    if (!room.isHighway && room.underAttack) return []

    const results = _.reduce(targetTypes, function(results, targetType) {
      switch (targetType) {
        case FIND_CONTAINERS:
          results.push(...room.containers)
          break

        case FIND_SOURCE_CONTAINERS:
          results.push(...room.sourceContainers)
          break

        case FIND_MINERAL_CONTAINERS:
          results.push(...room.mineralContainers)
          break

        case FIND_CONTROLLER_CONTAINER:
          results.push(room.controllerContainer)
          break

        case FIND_EXTENSIONS:
          results.push(...room.extensions)
          break

        case FIND_TOWERS:
          results.push(...room.towers)
          break

        case FIND_STORAGE:
          results.push(room.storage)
          break

        case FIND_DEFENSES:
          results.push(...room.defenses)
          break

        case FIND_UTILITY_STRUCTURES:
          results.push(...room.damagedStructures)
          break

        case FIND_SOURCES_ACTIVE:
          if (!results.length) {
            results.push(...room.sources)
          }

          break

        default:
          if (room.visible) {
            results.push(...room.find(targetType))
          }

          break
      }

      return results
    }, [], this)

    const targets = this.validator.filter(results)

    return targets
  }
}

global.TargetFinder = TargetFinder
