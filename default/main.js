const memoryManager = require('memory.manager');
const creepManager = require('creep.manager');

module.exports.loop = function () {
  console.log('########');

  memoryManager.clean();

  _.forEach(Game.rooms, function(room, _) {
    creepManager.spawnCreeps(room);
    creepManager.run();
  });
}
