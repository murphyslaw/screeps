'use strict'

global.Scoring = class extends State {
  get state() { return states.SCORING }

  findRoom() {
    return 'W10N30'
  }

  findTarget() {
    return this.room.scoreCollector
  }

  handleAction() {
    let result = State.RUNNING

    const actionResult = new Score(this.actor, this.target).update()

    switch (actionResult) {
      case OK:
        result = State.RUNNING
        break
      default:
        result = State.FAILED
        break
    }

    if (0 === this.actor.store.getUsedCapacity()) {
      result = State.SUCCESS
    }

    return result
  }

  handleMovement() {
    let result = State.SUCCESS

    if (!this.actor.pos.isNearTo(this.actor.destination)) {
      const from = this.actor.pos
      const to = this.actor.destination
      const path = this.findPath(from, to)

      const options = {
        path: path
      }

      const actionResult = new Move(this.actor, this.actor.destination, options).update()

      switch (actionResult) {
        case OK:
          result = State.RUNNING
          break
        default:
          result = State.FAILED
          break
      }
    }

    return result
  }

  findPath(from, to) {
    const allowedRooms = this.allowedRooms(from.roomName, to.roomName)

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

  allowedRooms(from, to) {
    const allowedRooms = { [from]: true }

    const route = Game.map.findRoute(from, to, {
      routeCallback(roomName) {
        const room = World.getRoom(roomName)

        if (!room.underAttack && (room.isHighway || room.my)) {
          return 1
        } else {
          return 2.5
        }
      }
    })

    route.forEach(info => allowedRooms[info.room] = true)

    return allowedRooms
  }
}
