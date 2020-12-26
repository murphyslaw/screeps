'use strict'

class StatsManager {
  reset() {
    Memory.stats = {
      gcl: {},
      rooms: {},
      cpu: {},
      creeps: {},
    }
  }

  exportRoomStats(room) {
    const stats = Memory.stats.rooms[room.name] = {}

    stats.score = (room.storage ? room.storage.store.score : 0)
    stats.storageEnergy = (room.storage ? room.storage.store.energy : 0)
    stats.terminalEnergy = (room.terminal ? room.terminal.store.energy : 0)
    stats.energyAvailable = room.energyAvailable
    stats.energyCapacityAvailable = room.energyCapacityAvailable
    stats.controllerProgress = room.controller.progress
    stats.controllerProgressTotal = room.controller.progressTotal
    stats.controllerLevel = room.controller.level
  }

  exportGlobalStats() {
    Memory.stats.time = Game.time

    Memory.stats.gcl.progress = Game.gcl.progress
    Memory.stats.gcl.progressTotal = Game.gcl.progressTotal
    Memory.stats.gcl.level = Game.gcl.level

    Memory.stats.cpu.bucket = Game.cpu.bucket
    Memory.stats.cpu.limit = Game.cpu.limit
    Memory.stats.cpu.used = Game.cpu.getUsed()

    config.roles.forEach(function(name) {
      Memory.stats.creeps[name] = World.creeps(name).length
    })
  }
}

global.statsManager = new StatsManager()
