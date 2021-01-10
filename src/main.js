'use strict'

require('require')

globalManager.notifyVersionChange()

module.exports.loop = function() {
  statsManager.reset()
  World.clean()
  World.update()

  _.forEach(World.myRooms, function(room) {
    roomManager.defense(room)

    statsManager.exportRoomStats(room)
  })

  creepManager.run()

  statsManager.exportGlobalStats()

  Sandbox.run()
}
