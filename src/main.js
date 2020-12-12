'use strict';

require('version');

if (!Memory.SCRIPT_VERSION || Memory.SCRIPT_VERSION != SCRIPT_VERSION) {
  Memory.SCRIPT_VERSION = SCRIPT_VERSION;
  console.log('New code uplodated', SCRIPT_VERSION);
}

module.exports.loop = function() {
  console.log(Game.time)
}
