'use strict'

global.Refilling = class extends State {
  findRoom() {
    return _.find(World.myRooms, 'storage').name
  }

  findTarget() {
    return this.room.storage
  }

  get resource() {
    switch(this.actor.role) {
      case 'scorer':
        return RESOURCE_SCORE
      default:
        return RESOURCE_ENERGY
    }
  }

  handleAction() {
    const actionResult = new Withdraw(this.actor, this.target, this.resource).update()

    switch (actionResult) {
      case OK:
      case ERR_FULL:
        return [State.SUCCESS, actionResult]

      case ERR_BUSY:
      case ERR_NOT_IN_RANGE:
        return [State.RUNNING, actionResult]

      case ERR_NOT_ENOUGH_RESOURCES:
      case ERR_INVALID_TARGET:
        this.actor.target = null
        return [State.RUNNING, actionResult]

      case ERR_INVALID_ARGS:
      case ERR_NO_BODYPART:
      case ERR_NOT_OWNER:
        return [State.FAILED, actionResult]

      default:
        console.log('REFILLING', 'unhandled action result', actionResult)
        return [State.FAILED, actionResult]
    }
  }

  handleMovement() {
    if (!this.actor.pos.isNearTo(this.actor.destination)) {
      let actionResult

      if (!this.actor.inDestinationRoom && !World.myRooms.includes(this.actor.room)) {
        const from = this.actor.pos
        const to = this.actor.destination
        const path = this.findPath(from, to)

        const options = { path: path }

        actionResult = new Move(this.actor, this.actor.destination, options).update()
      } else {
        actionResult = new Move(this.actor, this.actor.destination, {}).update()
      }

      switch (actionResult) {
        case OK:
        case ERR_BUSY:
        case ERR_TIRED:
          return [State.RUNNING, actionResult]

        case ERR_NO_PATH:
        case ERR_INVALID_TARGET:
          this.actor.destination = null
          return [State.RUNNING, actionResult]

        case ERR_NO_BODYPART:
        case ERR_NOT_OWNER:
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
