'use strict';

global.ScoreHarvester = class extends EnergyRole {
  get name() { return 'scoreharvester' }

  get bodyPattern() {
    return [CARRY, MOVE];
  }

  get maxCreepSize() {
    return this.bodyPattern.length * 6;
  }

  resource(creep) {
    return RESOURCE_SCORE;
  }

  number(room) {
    const roomsNeedScoreHarvester = _.filter(Memory.rooms, 'needsScoreHarvester');

    return roomsNeedScoreHarvester.length;
  }

  findTarget(creep) {
    return creep.room.storage;
  }

  invalidTarget(creep, target) {
    return target.store.getFreeCapacity(this.resource(creep)) == 0;
  }

  findSourceRoom(room) {
    let roomName = room.name

    if (!room.needsScoreHarvester) {
      _.forEach(Memory.rooms, function (room, name) {
        if (room.needsScoreHarvester) {
          roomName = name

          return
        }
      });
    }

    return roomName
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
    if (creep.transfer(target, this.resource(creep)) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    }

    return;
  }
};
