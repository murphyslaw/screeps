'use strict'

class MonumentPathFinder {
  find(scoreCollector) {
    const room = scoreCollector.room
    const start = new RoomPosition(38, 26, room.name)
    const goal = scoreCollector.pos

    const options = {
      plainCost: 1,
      swampCost: 1,
      range: 1,
      maxRooms: 1,
      costCallback: this.costCallback,
    }

    const path = start.findPathTo(goal, options)

    room.memory.scoreCollector.path = Room.serializePath(path)

    return path
  }

  costCallback(roomName, costMatrix) {
    const room = World.getRoom(roomName)

    const positions = room.scoreCollector.walls
    positions.forEach(function (position) {
      const structure = position.lookFor(LOOK_STRUCTURES)[0]
      let weight = 1

      if (structure && !structure.walkable) {
        weight = Math.floor(structure.hits / structure.hitsMax * 10)
      }

      costMatrix.set(position.x, position.y, weight)
    })

    // avoid other creeps in the room
    room.find(FIND_CREEPS).forEach(function (creep) {
      if (!creep.my) {
        costMatrix.set(creep.pos.x, creep.pos.y, Infinity)
      }
    })

    // handle special case to work together with joethebarber
    costMatrix.set(36, 24, Infinity)
  }
}

global.MonumentPathFinder = new MonumentPathFinder()
