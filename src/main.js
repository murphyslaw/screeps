'use strict'

require('require')

globalManager.notifyVersionChange()

module.exports.loop = function() {
  statsManager.reset()
  memoryManager.clean()

  if (Game.rooms['W20N30']) {
    const visualizer = new MonumentVisualizer(Game.rooms['W20N30'])
    visualizer.run()
  }

  _.forEach(Game.rooms, function(room) {
    roomManager.updateState(room)

    if(room.my) {
      roomManager.visuals(room)
      roomManager.defense(room)
      creepManager.spawn(room)
      creepManager.run()

      statsManager.exportRoomStats(room)
    }
  });

  statsManager.exportGlobalStats()

}
