'use strict'

class CreepManager {
  run() {
    _.forEach(World.myRooms, function (room) {
      room.update()
    })

    _.forEach(Game.creeps, function(creep, name) {
      Game.map.visual.rect(creep.pos, 1, 1, { fill: '#00ff00', opacity: 1 })

      try {
        creep.update()
      } catch (error) {
        console.log(error.stack, creep, creep.role.name, creep.pos)
      }
    })
  }
}

global.creepManager = new CreepManager()
