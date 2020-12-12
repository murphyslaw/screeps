'use strict';

const globalManager = require('manager_global');
globalManager.notifyVersionChange();

require('prototypes_lodash');
require('prototypes_room');
require('prototypes_source');
require('prototypes_roomposition');
require('prototypes_creep');
require('prototypes_structure');
require('prototypes_structurecontroller');
require('prototypes_structureextractor');
require('prototypes_mineral');
require('prototypes_store');

const memoryManager = require('manager_memory');
const creepManager = require('manager_creep');
const roomManager = require('manager_room');
const statsManager = require('manager_stats');

global.config = {
  visuals: false,
  stats: false,
  intelligence: true
}

module.exports.loop = function() {
  memoryManager.clean();

  _.forEach(Game.rooms, function(room) {
    room.updateState();

    if(room.controller && room.controller.my) {
      roomManager.stats(room);
      roomManager.visuals(room);
      roomManager.intelligence(room);
      roomManager.defense(room);
      creepManager.spawn(room);
      creepManager.run();
    }
  });

  statsManager.exportStats();
}
