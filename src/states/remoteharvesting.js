'use strict'

class RemoteHarvesting extends State {
  get icon() { return '🛢︎' }
  get validator() { return new FillingTargetValidator(this.role) }

  findRoom() {
    const rooms = this.actor.room.prioritize(World.remoteRooms)
    const creeps = World.creeps('RemoteHarvester')

    const room = _.find(rooms, function (room) {
      const harvestingCreeps = _.filter(creeps, function(creep) {
        return (creep.destination && creep.destination.roomName === room.name) ||
          (creep.target && creep.target.room.name === room.name)
      })

      return harvestingCreeps.length < room.sourceCount
    })

    return room && room.name
  }

  findTarget(room) {
    let actor = this.actor
    let targets = []

    const sources = _.filter(room.sources, target => this.validator.isValid(target))
    targets.push(...sources)

    return actor.pos.findClosestByRange(targets)
  }

  handleAction() {
    const actor = this.actor
    const target = actor.target
    const resource = this.role.resource

    const actionResult = new Harvest(actor, target).update()

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
        console.log('REMOTEHARVESTING', 'unhandled action result', actionResult)
        return State.FAILED
    }
  }
}

global.RemoteHarvesting = RemoteHarvesting
