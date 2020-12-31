'use strict'

class SourceValidator {
  vacancies(actor, source) {
    const creeps = _.filter(Game.creeps, function (creep) {
      let predicate = true

      predicate = predicate && creep.getActiveBodyparts(WORK)
      predicate = predicate && creep.target === source
      predicate = predicate && creep !== actor

      return predicate
    })

    if (creeps.length >= source.freeSpaceCount) return false

    const neededWorkparts = source.energyCapacity / HARVEST_POWER / ENERGY_REGEN_TIME
    const workpartsCount = _.sum(creeps, creep => creep.getActiveBodyparts(WORK))

    if (workpartsCount >= neededWorkparts) return false

    return true
  }
}

global.SourceValidator = new SourceValidator()
