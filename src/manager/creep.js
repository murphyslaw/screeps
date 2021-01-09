'use strict'

class CreepManager {
  spawn() {
    let spawned = false

    config.roles.forEach(function (name) {
      const role = new global[name]()

      if (!spawned && role.wantsToSpawn()) {
        let actionResult = role.spawn()

        actionResult === OK ? spawned = true : spawned = false
      }
    })
  }

  run() {
    this.spawn()

    _.forEach(Game.creeps, function(creep, name) {
      try {
        creep.update()
      } catch (error) {
        console.log(error.stack, creep, creep.role.name, creep.pos)
      }
    })
  }
}

global.creepManager = new CreepManager()
