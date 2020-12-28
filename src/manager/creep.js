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
    _.forEach(Game.creeps, function(creep, name) {
      try {
        creep.update()
      } catch (error) {
        console.log(error.stack, creep, creep.role, creep.pos)
      }
    })
  }
}

global.creepManager = new CreepManager()
