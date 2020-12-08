'use strict';

const EnergyRole = require('roles_energyrole');

class Repairer extends EnergyRole {
  get maxCreepSize() {
    return this.bodyPattern.length * 3;
  }

  get bodyPattern() {
    return [WORK, CARRY, MOVE];
  }

  number(room) {
    return room.damagedStructures.length > 0 ? 1 : 0;
  }

  findTarget(creep) {
    return creep.room.damagedStructures[0];
  }

  invalidTarget(target) {
    return target.hits == target.hitsMax;
  }

  targetAction(creep, target) {
    if (creep.repair(target) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    }
  }
};

module.exports = new Repairer();
