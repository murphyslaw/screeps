'use strict';

const EnergyRole = require('roles_energyrole');

class Hauler extends EnergyRole {
  get bodyPattern() {
    return [CARRY, MOVE];
  }

  get maxCreepSize() {
    return this.bodyPattern.length * 5;
  }

  number(room) {
    return room.sources.length;
  }

  findTarget(creep) {
    let target;

    // spawns, extensions and towers without full energy
    if (!target) {
      target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_SPAWN ||
            structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_TOWER) &&
            structure.store.getFreeCapacity(this.resource) > 0 &&
            !_.some(this.creeps, 'target', structure);
        }
      });
    }

    // storage without full energy
    if (!target) {
      target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
          return structure.structureType == STRUCTURE_STORAGE &&
            structure.store.getFreeCapacity(this.resource) > 0 &&
            !_.some(this.creeps, 'target', structure);
        }
      });
    }

    return target;
  }

  invalidTarget(target) {
    return target.store.getFreeCapacity(this.resource) == 0;
  }

  findSource(creep) {
    let source;

    // dropped energy
    if (!source) {
      const dropped = creep.room.find(FIND_DROPPED_RESOURCES, {
        filter: (resource) => {
          return !_.some(this.creeps, 'source', resource);
        }
      });

      if (dropped.length) {
        source = dropped[0];
      }
    }

    // tombstones with energy
    if (!source) {
      const tombstones = creep.room.find(FIND_TOMBSTONES, {
        filter: (tombstone) => {
          return tombstone.store[this.resource] > 0 &&
            !_.some(this.creeps, 'source', tombstone);
        }
      });

      if (tombstones.length) {
        source = tombstones[0];
      }
    }

    // ruins with energy
    if (!source) {
      const ruins = creep.room.find(FIND_RUINS, {
        filter: (ruin) => {
          return ruin.store[this.resource] > 0 &&
            !_.some(this.creeps, 'source', ruin);
        }
      });

      if (ruins.length) {
        source = ruins[0];
      }
    }

    // source containers with energy
    if (!source) {
      const sourceContainers = creep.room.sourceContainers;

      source = creep.pos.findClosestByPath(sourceContainers, {
        filter: (structure) => {
          return structure.store[this.resource] > 0 &&
            !_.some(this.creeps, 'source', structure);
        }
      });
    }

    return source;
  }

  targetAction(creep, target) {
    if (creep.transfer(target, this.resource) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    }

    return;
  }
};

module.exports = new Hauler();
