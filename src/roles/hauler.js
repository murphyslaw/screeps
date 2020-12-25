'use strict'

global.Hauler = class extends EnergyRole {
  get name() { return 'hauler' }

  get bodyPattern() {
    return [CARRY, MOVE]
  }

  get maxCreepSize() {
    return this.bodyPattern.length * 5
  }

  number(room) {
    let number = room.sources.length

    if (room.mineral && room.mineral.container) {
      number += 1
    }

    return number
  }

  findTarget(creep) {
    let target

    // spawns, extensions and towers without full energy
    if (!target && creep.store[RESOURCE_ENERGY] > 0) {
      target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_SPAWN ||
            structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_TOWER) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0 &&
            !_.some(this.creeps, 'target', structure)
        }
      })
    }

    // storage
    if (!target) {
      target = creep.room.storage
    }

    return target
  }

  invalidTarget(creep, target) {
    // target is invalid if its store has no capacity for any carried
    // resources or if the resources are not valid for it
    const invalid = _.every(creep.resources, function(resource) {
      const freeCapacity = target.store.getFreeCapacity(resource)

      return freeCapacity === 0 || freeCapacity === null
    })

    return invalid
  }

  findSource(creep) {
    let source

    // dropped energy
    if (!source) {
      const dropped = creep.room.find(FIND_DROPPED_RESOURCES, {
        filter: (resource) => {
          return !_.some(this.creeps, 'source', resource)
        }
      })

      if (dropped.length) {
        source = dropped[0]
      }
    }

    // tombstones with energy
    if (!source) {
      const tombstones = creep.room.find(FIND_TOMBSTONES, {
        filter: (tombstone) => {
          return tombstone.store.getUsedCapacity() > 0 &&
            !_.some(this.creeps, 'source', tombstone)
        }
      })

      if (tombstones.length) {
        source = tombstones[0]
      }
    }

    // ruins with energy
    if (!source) {
      const ruins = creep.room.find(FIND_RUINS, {
        filter: (ruin) => {
          return ruin.store.getUsedCapacity() > 0 &&
            !_.some(this.creeps, 'source', ruin)
        }
      })

      if (ruins.length) {
        source = ruins[0]
      }
    }

    // containers except the controller container
    if (!source) {
      const containers = creep.room.containers

      source = creep.pos.findClosestByRange(containers, {
        filter: (structure) => {
          return structure.store.getUsedCapacity() > creep.store.getFreeCapacity() &&
            structure != creep.room.controller.container
        }
      })
    }

    return source
  }

  sourceAction(creep, source) {
    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
      creep.moveTo(source)

      return
    }

    if (source.store) {
      _.forEach(source.store.resources, function (resource) {
        const result = creep.withdraw(source, resource)

        if (result === OK) {
          return
        }

        if (result == ERR_NOT_IN_RANGE) {
          creep.moveTo(source)

          return
        }
      })
    }

    if (creep.pickup(source) == ERR_NOT_IN_RANGE) {
      creep.moveTo(source)

      return
    }

    return
  }

  targetAction(creep, target) {
    _.forEach(creep.store.resources, function(resource) {
      const result = creep.transfer(target, resource)

      switch(result) {
        case ERR_NOT_IN_RANGE:
          creep.moveTo(target)
          break
        case ERR_INVALID_TARGET:
          creep.resetTarget()
          break
      }
    })

    return
  }
}
