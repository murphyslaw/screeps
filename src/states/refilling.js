'use strict'

class Refilling extends State {
  findRoom() {
    // prioritize current room
    const rooms = World.myRooms
    const currentRoom = this.actor.room
    const index = rooms.indexOf(currentRoom)

    if (index > 0) {
      rooms.splice(index, 1)
      rooms.unshift(currentRoom)
    }

    const room = _.find(rooms, function(room) {
      const targets = room.findWithPriorities(
        FIND_STRUCTURES,
        this.structurePriorities,
        structure => structure.store.getUsedCapacity(this.resource) > 0
      )

      return targets.length > 0
    }, this)

    return room.name
  }

  get structurePriorities() {
    return [
      STRUCTURE_STORAGE,
      STRUCTURE_CONTAINER,
    ]
  }

  validateTarget(target) {
    return target && target.store.getUsedCapacity(this.resource) > 0 ? target : null
  }

  findTarget() {
    const targets = this.room.findWithPriorities(
      FIND_STRUCTURES,
      this.structurePriorities,
      structure => structure.store.getUsedCapacity(this.resource) > 0
    )

    return targets[0]
  }

  get resource() {
    switch(this.actor.role) {
      case 'scorer':
      case 'scoreharvester':
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

  get movementOptions() { return { path: true } }
}

global.Refilling = Refilling
