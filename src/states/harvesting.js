'use strict'

class Harvesting extends State {
  findRoom() {
    // prioritize target
    const target = this.actor.target
    if (target) return target.room.name

    // prioritize current room
    const rooms = World.myRooms
    const currentRoom = this.actor.room
    const index = rooms.indexOf(currentRoom)

    if (index > 0) {
      rooms.splice(index, 1)
      rooms.unshift(currentRoom)
    }

    if ('ContainerHarvester' === this.actor.role) {
      const room = _.find(rooms, function(room) {
        return _.some(room.sources, function (source) {
          return source.container &&
            !_.some(World.creeps('ContainerHarvester'), 'target', source)
        })
      })

      return room ? room.name : null
    }

    const room = _.find(rooms, function(room) {
      return _.some(room.sources, source => source.vacancies())
    })

    return room ? room.name : null
  }

  validTarget(target) {
    return target && target.energy > 0
  }

  findTarget() {
    if ('ContainerHarvester' === this.actor.role) {
      const source = _.find(this.room.sources, function(source) {
        return source.container &&
          !_.some(World.creeps('ContainerHarvester'), 'target', source)
      })

      return source
    }

    const sources = this.room.sources
    const source = _.find(sources, source => source.vacancies()) || sources[0]

    return source
  }

  handleAction() {
    const actionResult = new Harvest(this.actor, this.target).update()

    switch (actionResult) {
      case OK:
        if (0 === this.actor.store.getFreeCapacity(this.resource)) {
          return State.SUCCESS
        } else {
          return State.RUNNING
        }

      case ERR_BUSY:
      case ERR_NOT_IN_RANGE:
      case ERR_TIRED:
        return State.RUNNING

      case ERR_NOT_ENOUGH_RESOURCES:
      case ERR_INVALID_TARGET:
        this.actor.target = null
        return State.RUNNING

      case ERR_NOT_FOUND:
      case ERR_NO_BODYPART:
      case ERR_NOT_OWNER:
        return State.FAILED

      default:
        console.log('HARVESTING', 'unhandled action result', actionResult)
        return State.FAILED
    }
  }

  targetBasedDestination(target) {
    if (!target) return target

    if ('ContainerHarvester' === this.actor.role) {
      return target.container.pos
    }

    return target.pos
  }

  validRange() {
    if ('ContainerHarvester' === this.actor.role) {
      return 0
    }

    return 1
  }
}

global.Harvesting = Harvesting
