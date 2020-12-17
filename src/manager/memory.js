'use strict';

class MemoryManager {
  constructor() {
    this.logger = new global.Logger('memory');
  }

  clean() {
    for (const name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
        this.logger.debug('Clearing non-existing creep memory:', name);
      }
    }

    for (const name in Memory.rooms) {
      if (!Game.rooms[name]) {
        delete Memory.rooms[name];
        this.logger.debug('Clearing non-visible room memory:', name);
      }
    }
  }
}

global.memoryManager = new MemoryManager();
