'use strict'

class GlobalManager {
  constructor() {
    this.logger = new global.Logger('global')
  }

  notifyVersionChange() {
    if (!Memory.SCRIPT_VERSION || Memory.SCRIPT_VERSION != global.SCRIPT_VERSION) {
      Memory.SCRIPT_VERSION = global.SCRIPT_VERSION
      this.logger.debug('New code uploaded', global.SCRIPT_VERSION)
    }
  }
}

global.globalManager = new GlobalManager()
