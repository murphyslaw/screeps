'use strict'

require('require')

globalManager.notifyVersionChange()

module.exports.loop = function() {
  statsManager.reset()
  World.clean()
  World.update()

  _.forEach(Game.rooms, function(room) {
    roomManager.visuals(room)

    if(room.my) {
      roomManager.defense(room)
      creepManager.run()

      statsManager.exportRoomStats(room)
    }
  })

  statsManager.exportGlobalStats()

  Sandbox.run()
}
