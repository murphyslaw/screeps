'use strict'

global.Move = class extends Action {
  constructor(actor, destination, options) {
    super()

    this.actor = actor
    this.destination = destination
    this.options = options

  }

  get visualizeOptions() {
    return {
      opacity: 1,
    }
  }

  update() {
    if (this.options.path) {
      const path = this.findPath(this.actor.pos, this.destination)

      // this.actor.room.visual.poly(_.filter(path, 'roomName', this.actor.room.name), this.visualizeOptions)

      return this.actor.moveByPath(path)
    }

    return this.actor.moveTo(this.destination, this.options)
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
        if (room.invisible) return true

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

        return costMatrix
      }
    }

    const path = PathFinder.search(from, to, options).path

    return path
  }
}
