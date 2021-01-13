'use strict'

require('require')

globalManager.notifyVersionChange()

module.exports.loop = function() {
  statsManager.reset()
  World.clean()
  World.update()

  roomManager.update()
  creepManager.run()

  statsManager.exportGlobalStats()

  Sandbox.run()
}
