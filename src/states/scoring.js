'use strict'

global.Scoring = class extends State {
  findRoom() {
    return 'W10N30'
  }

  findTarget() {
    return this.room.scoreCollector
  }

  handleAction() {
    const actionResult = new Score(this.actor, this.target).update()

    switch (actionResult) {
      case OK:
        return [State.SUCCESS, actionResult]

      case ERR_BUSY: // -4
      case ERR_NOT_IN_RANGE: // -9
        return [State.RUNNING, actionResult]

      case ERR_FULL: // -8
      case ERR_INVALID_TARGET: // -7
        this.actor.target = null
        return [State.RUNNING, actionResult]

      case ERR_NOT_ENOUGH_RESOURCES: // -6
      case ERR_INVALID_ARGS: // -10
      case ERR_NOT_OWNER: // -1
        return [State.FAILED, actionResult]

      default:
        console.log('SCORING', 'unhandled action result', actionResult)
        return [State.FAILED, actionResult]
    }
  }

  handleMovement() {
    if (!this.actor.pos.isNearTo(this.actor.destination)) {
      const from = this.actor.pos
      const to = this.actor.destination
      const path = this.findPath(from, to)

      const options = { path: path }

      const actionResult = new Move(this.actor, this.actor.destination, options).update()

      switch (actionResult) {
        case OK: // 0
        case ERR_BUSY: // -4
        case ERR_TIRED: // -11
          return [State.RUNNING, actionResult]

        case ERR_NO_PATH: // -2
        case ERR_INVALID_TARGET: // -7
          this.actor.destination = null
          this.actor.target = null
          return [State.RUNNING, actionResult]

        case ERR_NO_BODYPART: // -12
        case ERR_NOT_OWNER: // -1
        default:
          return [State.FAILED, actionResult]
      }
    }

    return [State.RUNNING, OK]
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
