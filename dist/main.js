require('global');

require('prototypes_lodash');
require('prototypes_room');
require('prototypes_source');
require('prototypes_roomposition');

const memoryManager = require('memory.manager');
const creepManager = require('creep.manager');
const roomManager = require('room.manager');

module.exports.loop = function() {
  memoryManager.clean();

  _.forEach(Game.rooms, function(room, roomName) {
    console.log('room: ', roomName);
    roomManager.defense(room);
    creepManager.run(room);
  });
}
