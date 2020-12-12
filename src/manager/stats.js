'use strict';

class StatsManager {
  exportStats() {
    Memory.stats = {
      gcl: {},
      rooms: {},
      cpu: {},
    };

    Memory.stats.time = Game.time;

    for (let roomName in Game.rooms) {
      const room = Game.rooms[roomName];
      const isMyRoom = (room.controller ? room.controller.my : false);
      if (isMyRoom) {
        const roomStats = Memory.stats.rooms[roomName] = {};
        roomStats.storageEnergy = (room.storage ? room.storage.store.energy : 0);
        roomStats.terminalEnergy = (room.terminal ? room.terminal.store.energy : 0);
        roomStats.energyAvailable = room.energyAvailable;
        roomStats.energyCapacityAvailable = room.energyCapacityAvailable;
        roomStats.controllerProgress = room.controller.progress;
        roomStats.controllerProgressTotal = room.controller.progressTotal;
        roomStats.controllerLevel = room.controller.level;
      }
    }

    Memory.stats.gcl.progress = Game.gcl.progress;
    Memory.stats.gcl.progressTotal = Game.gcl.progressTotal;
    Memory.stats.gcl.level = Game.gcl.level;

    Memory.stats.cpu.bucket = Game.cpu.bucket;
    Memory.stats.cpu.limit = Game.cpu.limit;
    Memory.stats.cpu.used = Game.cpu.getUsed();
  }
}

module.exports = new StatsManager();
