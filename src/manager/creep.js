'use strict'

class CreepManager {
  spawn(room) {
    let spawned = false;

    _.forEach(global.roles, function (role) {
      if (!spawned && role.wantsToSpawn(room)) {
        let actionResult = role.spawn(room)

        actionResult === OK ? spawned = true : spawned = false
      }
    })
  }

  run() {
    const scout = Game.time % 20

    for (const name in Game.creeps) {
      const creep = Game.creeps[name]

      try {
        global.roles[creep.role].run(creep)

        // scout
        if (scout) {
          Memory.rooms[creep.room.name] = Memory.rooms[creep.room.name] || {}
        }
      } catch(error) {
        console.log(error.stack, creep, creep.role, creep.pos)
      }
    }
  }
}

global.creepManager = new CreepManager()
