require('lodash.prototype');
require('room.prototype');
require('source.prototype');
require('roomposition.prototype');

require('version')

if (!Memory.SCRIPT_VERSION || Memory.SCRIPT_VERSION != SCRIPT_VERSION) {
  Memory.SCRIPT_VERSION = SCRIPT_VERSION;
  console.log('New code uplodated', SCRIPT_VERSION);
}

const memoryManager = require('memory.manager');
const creepManager = require('creep.manager');

module.exports.loop = function () {
  memoryManager.clean();

  _.forEach(Game.rooms, function(room, roomName) {
    console.log('room: ', roomName);
    creepManager.run(room);
  });
}
