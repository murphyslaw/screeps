'use strict';

const EnergyRole = require('roles_energyrole');

class ScoreHarvester extends EnergyRole {
  get bodyPattern() {
    return [CARRY, MOVE];
  }

  get maxCreepSize() {
    return this.bodyPattern.length * 6;
  }

  get resource() {
    return RESOURCE_SCORE;
  }

  number(room) {
    return room.scoreContainers.length;
  }

  findTarget(creep) {
    return creep.room.storage;
  }

  invalidTarget(target) {
    return target.store.getFreeCapacity(this.resource) == 0;
  }

  findSource(creep) {
    let source;

    // score containers
    if (!source) {
      const scoreContainers = creep.room.scoreContainers;

      if (scoreContainers.length) {
        source = scoreContainers[0];
      }
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

module.exports = new ScoreHarvester();
