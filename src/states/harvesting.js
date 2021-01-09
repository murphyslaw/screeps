'use strict'

class Harvesting extends State {
  get icon() { return '🛢︎' }
  get validator() { return new FillingTargetValidator(this.role) }

  findRoom() {
    const actor = this.actor

    // prioritize current target
    const target = actor.target
    if (this.validator.isValid(target)) return target.room.name

    const rooms = actor.room.prioritize(World.territory)

    if ('ContainerHarvester' === actor.role) {
      const room = _.find(rooms, function(room) {
        return _.some(room.sources, function(source) {
          return source.container &&
            !_.some(World.creeps('ContainerHarvester'), 'memory.target', source.id)
        })
      })

      return room
    }

    const room = _.find(rooms, function(room) {
      return _.some(room.sources, source => this.validator.isValid(source))
    })

    return room
  }

  findTarget(room) {
    const actor = this.actor

    if ('ContainerHarvester' === actor.role) {
      const source = _.find(room.sources, function(source) {
        return source.container &&
          !_.some(World.creeps('ContainerHarvester'), 'memory.target', source.id)
      })

      return source
    }

    const sources = room.sources
    const source = _.find(sources, source => this.validator.isValid(source))

    return source
  }

  handleAction() {
    const actor = this.actor
    const target = actor.target
    const resource = this.role.resource

    const actionResult = new Harvest(actor, target).execute()

    switch (actionResult) {
      case OK:
        if (0 === actor.store.getFreeCapacity(resource)) {
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
        this.changeTarget(actor, null)
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
      return target.container
    }

    return target
  }

  validRange() {
    if ('ContainerHarvester' === this.actor.role) {
      return 0
    }

    return 1
  }
}

global.Harvesting = Harvesting
