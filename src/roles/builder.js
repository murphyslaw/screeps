'use strict'

global.Builder = class extends EnergyRole {
  get name() { return 'builder' }

  get maxCreepSize() {
    return this.bodyPattern.length * 6
  }

  get bodyPattern() {
    return [WORK, CARRY, MOVE]
  }

  number(room) {
    const needsBuilder = _.some(Memory.rooms, 'needsBuilder')

    return needsBuilder ? 1 : 0
  }

  findTargetRoom(room) {
    let roomName = room.name

    _.forEach(Memory.rooms, function (room, name) {
      if (room.needsBuilder) {
        roomName = name
        return
      }
    });

    return roomName
  }

  findTarget(creep) {
    return creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES)
  }

  targetAction(creep, target) {
    if (creep.build(target) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target)
    }
  }
}
