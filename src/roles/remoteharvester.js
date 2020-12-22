'use strict'

global.RemoteHarvester = class extends EnergyRole {
  get name() { return 'remoteharvester' }

  get bodyPattern() {
    return [WORK, CARRY, MOVE, MOVE]
  }

  get maxCreepSize() {
    return this.bodyPattern.length * 8
  }

  get keepSource() {
    return true
  }

  get keepTarget() {
    return true
  }

  number(room) {
    if (!room.storage) { return 0 }

    return _.keys(World.remoteRooms).length
  }

  findSourceRoom(room) {
    const remoteRooms = World.remoteRooms

    const creeps = this.creeps

    const sourceRoom = _.find(remoteRooms, function(room) {
      return !_.some(creeps, creep => creep.sourceRoom === room.name)
    })

    return sourceRoom && sourceRoom.name
  }

  findSource(creep) {
    return creep.pos.findClosestByPath(creep.room.sources)
  }

  findTarget(creep) {
    return creep.room.storage
  }

  invalidTarget(creep, target) {
    return target.store && target.store.getFreeCapacity(this.resource(creep)) == 0
  }

  targetAction(creep, target) {
    if (creep.transfer(target, this.resource(creep)) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target)
    }

    return
  }
}