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
    const needsBuilder = _.some(World.territory, 'needsBuilder')

    return needsBuilder ? 1 : 0
  }

  findTargetRoom(room) {
    room = _.find(World.territory, 'needsBuilder')

    if (room) return room.name

    return
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
