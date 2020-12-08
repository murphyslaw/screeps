'use strict';

global.ROLES = {
  harvester: require('roles_harvester'),
  remoteharvester: require('roles_remoteharvester'),
  hauler: require('roles_hauler'),
  builder: require('roles_builder'),
  upgrader: require('roles_upgrader'),
  repairer: require('roles_repairer'),
  scoreharvester: require('roles_scoreharvester'),
  supplier: require('roles_supplier')
};

class CreepManager {
  spawn(room) {
    _.forEach(ROLES, function (role) {
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
