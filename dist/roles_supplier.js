'use strict';

const EnergyRole = require('roles_energyrole');

class Supplier extends EnergyRole {
  get bodyPattern() {
    return [CARRY, MOVE];
  }

  get maxCreepSize() {
    return this.bodyPattern.length * 2;
  }

  number(room) {
    return room.storage ? 1 : 0;
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
            structure.store.getFreeCapacity(this.resource(creep)) > 0;
        }
      });
    }

    // controller container
    if (!target) {
      target = creep.room.controller.container;
    }

    return target;
  }

  invalidTarget(creep, target) {
    return target.store.getFreeCapacity(this.resource(creep)) == 0;
  }

  findSource(creep) {
    let source;

    // storage
    if (!source) {
      if (creep.room.storage && creep.room.storage.store[this.resource(creep)] > 0) {
        source = creep.room.storage;
      }
    }

    return source;
  }

  targetAction(creep, target) {
    if (creep.transfer(target, this.resource(creep)) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    }

    return;
  }
};

module.exports = new Supplier();
