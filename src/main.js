'use strict'

require('version')

if (!Memory.SCRIPT_VERSION || Memory.SCRIPT_VERSION != SCRIPT_VERSION) {
  Memory.SCRIPT_VERSION = SCRIPT_VERSION
  console.log('New code uploaded', SCRIPT_VERSION)
}

module.exports.loop = function() {
  const roomName = 'sim'
  const room = Game.rooms[roomName]
  const creep = Game.creeps['Molly']
}
