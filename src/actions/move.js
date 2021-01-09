'use strict'

class Move extends Action {
  constructor(actor, destination, options) {
    super()

    this.actor = actor
    this.destination = destination
    this.options = options || {}

  }

  execute() {
    const actor = this.actor
    const destination = this.destination
    const options = this.options

    if (options.path) {
      const path = this.findPath(actor.pos, destination)

      return actor.moveByPath(path)
    }

    return actor.moveTo(destination, options)
  }

  findPath(from, to) {
    const allowedRooms = World.allowedRooms(from.roomName, to.roomName)

    const options = {
      plainCost: 2,
      swampCost: 10,
      range: 1,
      maxRooms: 11,
      roomCallback(roomName) {
        if (undefined === allowedRooms[roomName]) return false

        let room = World.getRoom(roomName)
        if (!room.visible) return true

        let costMatrix = new PathFinder.CostMatrix

        room.find(FIND_STRUCTURES).forEach(function (structure) {
          const position = structure.pos

          switch (structure.structureType) {
            case STRUCTURE_ROAD:
              costMatrix.set(position.x, position.y, 1)
              break
            default:
              if (!structure.walkable) {
                costMatrix.set(position.x, position.y, Infinity)
              }
          }
        })

        room.find(FIND_MY_CREEPS).forEach(function (creep) {
          costMatrix.set(creep.pos.x, creep.pos.y, Infinity)
        })

        return costMatrix
      }
    }

    const path = PathFinder.search(from, to, options).path

    return path
  }
}

global.Move = Move
