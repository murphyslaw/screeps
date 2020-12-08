'use strict';

const globalManager = require('manager_global');
globalManager.notifyVersionChange();

require('prototypes_lodash');
require('prototypes_room');
require('prototypes_source');
require('prototypes_roomposition');
require('prototypes_creep');
require('prototypes_structurecontroller');

const memoryManager = require('manager_memory');
const creepManager = require('manager_creep');
const roomManager = require('manager_room');

module.exports.loop = function() {
  memoryManager.clean();

  _.forEach(Game.rooms, function(room) {
    if(room.controller && room.controller.my) {
      roomManager.intelligence(room);
      roomManager.defense(room);
      creepManager.spawn(room);
      creepManager.run();
    }
  });
}
