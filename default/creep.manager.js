const roleHarvester = require('role.harvester');

const creepManager = {
  spawnCreeps: function (room) {
    const roles = [roleHarvester];
    const spawn = room.find(FIND_MY_SPAWNS)[0];

    _.forEach(roles, function(roleManager) {
      const { role, number, bodyparts, memory } = roleManager.configuration(room);

      const creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);
      const count = creeps.length;
      console.log(role + 's: ' + count);

      if (count < number) {
        const name = role + Game.time;
        console.log('Spawning new ' + role + ': ' + name);
        spawn.spawnCreep(bodyparts, name, { memory: memory });
      }
    });

    if (spawn.spawning) {
      const spawningCreep = Game.creeps[spawn.spawning.name];

      spawn.room.visual.text(
        '🛠️' + spawningCreep.memory.role,
        spawn.pos.x + 1,
        spawn.pos.y,
        { align: 'left', opacity: 0.8 });
    }
  },

  run: function() {
    _.forEach(Game.creeps, function (creep, _) {
      switch (creep.memory.role) {
        case 'harvester':
          roleHarvester.run(creep);
          break;
        case 'upgrader':
          roleUpgrader.run(creep);
          break;
        case 'builder':
          roleBuilder.run(creep);
          break;
        case 'repairer':
          roleBuilder.run(creep);
          break;
      }
    });
  }
};

module.exports = creepManager;
