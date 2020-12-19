'use strict'

require('version')

if (!Memory.SCRIPT_VERSION || Memory.SCRIPT_VERSION != SCRIPT_VERSION) {
  Memory.SCRIPT_VERSION = SCRIPT_VERSION
  console.log('New code uploaded', SCRIPT_VERSION)
}

module.exports.loop = function() {
  const roomName = 'sim'
  const room = Game.rooms[roomName]
  const creep = Game.creeps['Avery']

  // const flag = Game.flags['Flag1']
  // creep.memory.target = flag.name

  const source = creep.pos.findClosestByRange(FIND_SOURCES)
  creep.memory.target = source.id

  const position = new RoomPosition(25, 25, 'sim')
  creep.memory.target = position

  if (!creep.memory._move) {
    creep.memory._move = {}
  }

  // const pos = flag.pos
  // const pos = source.pos
  const pos = position
  creep.memory._move.dest = { x: pos.x, y: pos.y, room: pos.roomName }

  console.log(Game.time, JSON.stringify(creep.memory._move))

  // const target = Game.getObjectById(creep.memory.target) // source
  // const target = Game.flags[creep.memory.target] // flag
  const target = new RoomPosition(creep.memory.target.x, creep.memory.target.y, creep.memory.target.roomName) // position
  if (creep.pos.isNearTo(target)) {
    const result = creep.harvest(target, RESOURCE_ENERGY)
    console.log(Game.time, 'harvest', result)
  } else {
    const destInfo = creep.memory._move.dest
    const dest = new RoomPosition(destInfo.x, destInfo.y, destInfo.room)

    const result = creep.moveTo(dest)
    console.log(Game.time, 'moveTo', result)
  }
}
