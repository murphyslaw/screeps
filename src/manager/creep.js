'use strict'

class CreepManager {
  spawn(room) {
    let spawned = false

    config.roles.forEach(function (name) {
      const role = new global[name]()
      if (!spawned && role.wantsToSpawn(room)) {
        let actionResult = role.spawn(room)

        actionResult === OK ? spawned = true : spawned = false
      }
    })
  }

  run() {
    const scout = Game.time % 20

    _.forEach(Game.creeps, function(creep, name) {
      try {
        creep.update()

        // scout
        if (scout) {
          Memory.rooms[creep.room.name] = Memory.rooms[creep.room.name] || {}
        }
      } catch (error) {
        console.log(error.stack, creep, creep.role, creep.pos)
      }
    })
  }
}

global.creepManager = new CreepManager()
