'use strict';

class CreepManager {
  spawn(room) {
    let spawned = false;

    _.forEach(global.roles, function (role) {
      if (global.config.stats) {
        console.log(role.name, role.creeps.length);
      }

      if (!spawned && role.wantsToSpawn(room)) {
        role.spawn(room);
        spawned = true;
      }
    });
  }

  run() {
    for (const name in Game.creeps) {
      const creep = Game.creeps[name];

      try {
        global.roles[creep.role].run(creep);
      } catch(error) {
        console.log(error.stack, creep, creep.role)
      }
    }
  }
};

global.creepManager = new CreepManager();
