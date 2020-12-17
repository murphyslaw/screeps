'use strict';

global.DefenseRepairer = class extends EnergyRole {
  get name() { return 'defenserepairer' }

  get maxCreepSize() {
    return this.bodyPattern.length * 5;
  }

  get bodyPattern() {
    return [WORK, CARRY, MOVE];
  }

  number(room) {
    return 1;
  }

  findTarget(creep) {
    let damagedDefenses = creep.room.damagedDefenses;

    const towers = _.filter(damagedDefenses, function(structure) {
      return structure.structureType == STRUCTURE_TOWER &&
        !_.some(this.creeps, 'target', structure);
    });

    if (towers.length) {
      towers = towers.sort((a, b) => a.hits - b.hits);

      return towers[0];
    }

    let structures = [];

    if (!structures.length) {
      structures = _.filter(damagedDefenses, function (structure) {
        return !_.some(this.creeps, 'target', structure);
      }, this);
    }

    structures = structures.sort((a, b) => a.hits - b.hits);

    return structures[0];
  }

  targetAction(creep, target) {
    if (creep.repair(target) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    }
  }
};
