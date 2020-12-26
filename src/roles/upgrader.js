'use strict'

class Upgrader extends EnergyRole {
  get name() { return 'Upgrader' }
  get bodyPattern() { return [WORK, CARRY, MOVE] }
  get maxCreepSize() { return this.bodyPattern.length * 6}

  number(room) { return World.myRooms.length + 1 }

  findSourceRoom(room) {
    room = _.min(World.myRooms, function(myRoom) {
      let count = myRoom.creeps('upgrader').length

      // don't count the searching creep
      if (room === myRoom) count -= 1

      return count
    })

    return room.name
  }

  findSource(creep) {
    let source

    // controller container
    if (!source) {
      const container = _.get(creep.room, 'controller.container')

      if (container && container.store[this.resource(creep)] > 0) {
        source = container
      }
    }

    // storage
    if (!source) {
      const storage = creep.room.storage

      if (storage && storage.store[this.resource(creep)] > 0)
      source = creep.room.storage
    }

    // energy source
    if (!source) {
      source = creep.pos.findClosestByPath(creep.room.sources)
    }

    return source
  }

  findTargetRoom(room) {
    room = _.min(World.myRooms, function (myRoom) {
      let count = myRoom.creeps('upgrader').length

      // don't count the searching creep
      if (room === myRoom) count -= 1

      return count
    })

    return room.name
  }

  findTarget(creep) { return creep.room.controller }

  targetAction(creep, target) {
    if (creep.upgradeController(target) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target)
    }

    return
  }
}

global.Upgrader = Upgrader
