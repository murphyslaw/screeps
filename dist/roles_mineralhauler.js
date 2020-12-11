'use strict';

const EnergyRole = require('roles_energyrole');

class MineralHauler extends EnergyRole {
  get bodyPattern() {
    return [CARRY, MOVE];
  }

  get maxCreepSize() {
    return this.bodyPattern.length * 5;
  }

  resource(creep) {
    return creep.sourceType;
  }

  number(room) {
    return room.mineralContainers.length;
  }

  findTarget(creep) {
    let target;

    // storage
    if (!target) {
      target = creep.room.storage;
    }

    return target;
  }

  invalidTarget(creep, target) {
    return target.store.getFreeCapacity(this.resource(creep)) == 0;
  }

  findSource(creep) {
    let source;

    // mineral container
    if (!source) {
      const minerals = creep.room.find(FIND_MINERALS, {
        filter: (mineral) => {
          return mineral.container &&
            mineral.container.store.getUsedCapacity() > creep.store.getFreeCapacity() &&
            !_.some(this.creeps, 'source', mineral);
        }
      });

      if (minerals.length) {
        creep.sourceType = minerals[0].mineralType;
        source = minerals[0].container;
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

module.exports = new MineralHauler();
