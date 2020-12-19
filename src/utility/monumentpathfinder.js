'use strict'

global.MonumentPathFinder = class {
  find(start, goal) {
    const options = {
      plainCost: 1,
      swampCost: 1,
      range: 1,
      maxRooms: 1,
      costCallback: this.costCallback,
    }

    const result = start.findPathTo(goal, options)

    return result
  }

  costCallback(roomName, costMatrix) {
    const room = Game.rooms[roomName]

    if (!room) return
    if (!room.scoreCollector) return

    const positions = room.scoreCollector.pos.neighbors(WALLS_RADIUS)
    positions.forEach(function (position) {
      const structure = position.lookFor(LOOK_STRUCTURES)[0]
      const hitPercent = Math.floor(structure.hits / structure.hitsMax * 10)
      const weight = structure && !structure.walkable ? hitPercent : 1

      costMatrix.set(position.x, position.y, weight)
    })

    // avoid creeps in the room
    room.find(FIND_CREEPS).forEach(function (creep) {
      costMatrix.set(creep.pos.x, creep.pos.y, Infinity)
    })
  }
}
