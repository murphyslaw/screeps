'use strict';

class MemoryManager {
  clean() {
    for (const name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
        console.log('Clearing non-existing creep memory:', name);
      }
    }
  }
}

module.exports = new MemoryManager();
