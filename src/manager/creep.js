'use strict';

global.ROLES = {
  harvester: require('roles_harvester'),
  remoteharvester: require('roles_remoteharvester'),
  energyhauler: require('roles_energyhauler'),
  mineralhauler: require('roles_mineralhauler'),
  builder: require('roles_builder'),
  upgrader: require('roles_upgrader'),
  repairer: require('roles_repairer'),
  defenserepairer: require('roles_defenserepairer'),
  scoreharvester: require('roles_scoreharvester'),
  supplier: require('roles_supplier'),
  containerharvester: require('roles_containerharvester'),
  containerextractor: require('roles_containerextractor')
};

class CreepManager {
  spawn(room) {
    _.forEach(ROLES, function (role) {
      if (global.config.stats) {
        console.log(role.name, role.creeps.length);
      }

      if (role.wantsToSpawn(room)) {
        role.spawn(room);
      }
    });
  }

  run() {
    for (const name in Game.creeps) {
      const creep = Game.creeps[name];
      ROLES[creep.role].run(creep);
    }
  }
};

module.exports = new CreepManager();
