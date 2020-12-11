'use strict';

const EnergyRole = require('roles_energyrole');

class EnergyHauler extends EnergyRole {
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
            structure.store.getFreeCapacity(this.resource(creep)) > 0 &&
            !_.some(this.creeps, 'target', structure);
        }
      });
    }

    // storage
    if (!target) {
      target = creep.room.storage;
    }

    return target;
  }

  invalidTarget(creep, target) {
    const result = _.some(creep.resources, function (resource) {
      return target.store.getFreeCapacity(resource) === 0;
    });

    return result;
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
          return tombstone.store[this.resource(creep)] > 0 &&
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
          return ruin.store[this.resource(creep)] > 0 &&
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
          return structure.store[this.resource(creep)] > 0 &&
            !_.some(this.creeps, 'source', structure);
        }
      });
    }

    return source;
  }

  targetAction(creep, target) {
    _.forEach(_.keys(creep.store), function(resource) {
      const result = creep.transfer(target, resource);

      switch(result) {
        case ERR_NOT_IN_RANGE:
          creep.moveTo(target);
          break;
        case ERR_INVALID_TARGET:
          creep.resetTarget();
          break;
      }
    });

    return;
  }
};

module.exports = new EnergyHauler();
