'use strict';

global.Harvester = class extends EnergyRole {
  get name() { return 'harvester' }
  get maxCreepSize() { return this.bodyPattern.length * 5 }
  get bodyPattern() { return [WORK, CARRY, MOVE] }

  number(room) { return 0 }

  findTargetRoom(room) { return 'W18N29' }

  findTarget(creep) {
    let targets = []

    // spawns, extensions and towers without full energy
    if (!targets.length && creep.store[RESOURCE_ENERGY] > 0) {
      targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_SPAWN ||
            structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_TOWER) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0 &&
            !_.some(this.creeps, 'target', structure);
        }
      })
    }

    // containers and storage without full energy
    if (!targets.length) {
      targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_CONTAINER ||
            structure.structureType == STRUCTURE_STORAGE) &&
            structure.store.getFreeCapacity() > 0
        }
      })
    }

    const target = targets.length > 1 ? creep.pos.findClosestByRange(targets) : targets[0]

    return target
  }

  findSourceRoom(room) {
    return 'W18N29'
  }

  findSource(creep) {
    const sources = creep.room.sources

    // for (const source of sources) {
    //   if (source && source.vacancies()) {
    //     return source
    //   }
    // }

    return sources[0]
  }

  invalidTarget(creep, target) {
    return target.store && 0 === target.store.getFreeCapacity(this.resource(creep))
  }

  targetAction(creep, target) {
    if (ERR_NOT_IN_RANGE === creep.transfer(target, this.resource(creep))) {
      creep.moveTo(target)
    }

    return
  }
}
