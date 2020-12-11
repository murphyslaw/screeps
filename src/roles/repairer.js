'use strict';

const EnergyRole = require('roles_energyrole');

class Repairer extends EnergyRole {
  get maxCreepSize() {
    return this.bodyPattern.length * 5;
  }

  get bodyPattern() {
    return [WORK, CARRY, MOVE];
  }

  number(room) {
    return room.damagedStructures.length > 0 ? 2 : 0;
  }

  findTargetRoom(room) {
    let roomName = room.name;

    // _.forEach(Memory.rooms, function (room, name) {
    //   if (room.needsRepairer) {
    //     roomName = name;
    //     return;
    //   }
    // });

    return roomName;
  }

  findTarget(creep) {
    let target = creep.pos.findClosestByRange(creep.room.damagedStructures, {
      filter: (structure) => {
        return !_.some(this.creeps, 'target', structure);
      }
    });

    return target;
  }

  invalidTarget(creep, target) {
    return target.healthy;
  }

  targetAction(creep, target) {
    if (creep.repair(target) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    }
  }
};

module.exports = new Repairer();
