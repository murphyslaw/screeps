const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleRepairer = require('role.repairer');

const creepManager = {
  run: function (room) {
    const roles = [roleHarvester, roleUpgrader, roleBuilder, roleRepairer];
    const spawn = room.find(FIND_MY_SPAWNS)[0];

    _.forEach(roles, function(roleManager) {
      const { role, number, bodyparts, memory } = roleManager.configuration(room);

      const creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);
      const count = creeps.length;
      console.log(role + 's: ' + count + '/' + number);

      if (count < number) {
        const name = role + Game.time;
        console.log('Spawning new ' + role + ': ' + name);
        spawn.spawnCreep(bodyparts, name, { memory: memory });
      }

      _.forEach(creeps, function(creep) {
        roleManager.run(creep);
      })
    });

    if (spawn.spawning) {
      const spawningCreep = Game.creeps[spawn.spawning.name];

      spawn.room.visual.text(
        '🛠️' + spawningCreep.memory.role,
        spawn.pos.x + 1,
        spawn.pos.y,
        { align: 'left', opacity: 0.8 });
    }
  }
};

module.exports = creepManager;