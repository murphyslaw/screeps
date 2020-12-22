'use strict';

global.Repairer = class extends EnergyRole {
  get name() { return 'repairer' }

  get maxCreepSize() {
    return this.bodyPattern.length * 5;
  }

  get bodyPattern() {
    return [WORK, CARRY, MOVE];
  }

  number(room) {
    return room.damagedStructures.length > 0 ? 1 : 0;
  }

  findTargetRoom(room) {
    room = _.find(World.territory, 'needsRepairer')

    if (room) return room.name

    return
  }

  findTarget(creep) {
    let target = creep.pos.findClosestByRange(creep.room.damagedStructures)

    return target
  }

  invalidTarget(creep, target) {
    return target.healthy;
  }

  targetAction(creep, target) {
    if (creep.repair(target) === ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    }
  }
};
