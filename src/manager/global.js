'use strict';

require('version');

class GlobalManager {
  notifyVersionChange() {
    if (!Memory.SCRIPT_VERSION || Memory.SCRIPT_VERSION != SCRIPT_VERSION) {
      Memory.SCRIPT_VERSION = SCRIPT_VERSION;
      console.log('New code uplodated', SCRIPT_VERSION);
    }
  }
}

module.exports = new GlobalManager();
