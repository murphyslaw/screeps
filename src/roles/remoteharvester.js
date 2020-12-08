'use strict';

const EnergyRole = require('roles_energyrole');

class RemoteHarvester extends EnergyRole {
  get bodyPattern() {
    return [WORK, CARRY, MOVE];
  }

  number(room) {
    // return room.storage ? _.keys(Game.map.describeExits(room.name)).length : 0;
    return 0;
  }

  findSourceRoom(room) {
    const adjacentRooms = Game.map.describeExits(room.name);

    const creeps = this.creeps;

    return _.find(adjacentRooms, function(roomName) {
      return !_.some(creeps, creep => creep.sourceRoom == roomName);
    })
  }

  findSource(creep) {
    return creep.pos.findClosestByPath(creep.room.sources);
  }

  findTarget(creep) {
    return creep.room.storage;
  }

  // validate if the target store got full in the meantime
  invalidTarget(target) {
    return target.store && target.store.getFreeCapacity(this.resource) == 0;
  }

  targetAction(creep, target) {
    if (target.progress && creep.build(target) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    }

    if (target.structureType == STRUCTURE_CONTROLLER && creep.upgradeController(target) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    }

    if (creep.transfer(target, this.resource) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    }

    return;
  }
};

module.exports = new RemoteHarvester();
