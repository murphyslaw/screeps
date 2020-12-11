'use strict';

const EnergyRole = require('roles_energyrole');

class RemoteHarvester extends EnergyRole {
  get bodyPattern() {
    return [WORK, CARRY, MOVE, MOVE];
  }

  get maxCreepSize() {
    return this.bodyPattern.length * 5;
  }

  get keepSource() {
    return true;
  }

  get keepTarget() {
    return true;
  }

  number(room) {
    return room.storage ? _.keys(Game.map.describeExits(room.name)).length : 0;
  }

  findSourceRoom(room) {
    const adjacentRooms = Game.map.describeExits(room.name);

    const creeps = this.creeps;

    const sourceRoom = _.find(adjacentRooms, function(roomName) {
      return !_.some(creeps, creep => creep.sourceRoom == roomName);
    })

    return sourceRoom;
  }

  findSource(creep) {
    return creep.pos.findClosestByPath(creep.room.sources);
  }

  findTarget(creep) {
    return creep.room.storage;
  }

  invalidTarget(creep, target) {
    return target.store && target.store.getFreeCapacity(this.resource(creep)) == 0;
  }

  targetAction(creep, target) {
    if (creep.transfer(target, this.resource(creep)) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    }

    return;
  }
};

module.exports = new RemoteHarvester();
