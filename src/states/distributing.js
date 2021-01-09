'use strict'

class Distributing extends State {
  get icon() { return '🚚' }
  get validator() { return new EmptyingTargetValidator(this.role) }

  update() {
    const actor = this.actor
    const target = actor.target = this.target

    if (!target) {
      return State.FAILED
    }

    if (!actor.inTargetRoom) {
      new Move(actor, target.room.center).execute()

      return State.RUNNING
    }

    const resourceType = RESOURCE_ENERGY
    const actionResult = new Transfer(actor, target, resourceType).execute()

    switch(actionResult) {
      case OK:
        const targetFreeCapacity = target.store.getFreeCapacity(resourceType)
        if (targetFreeCapacity >= actor.store.getUsedCapacity(resourceType)) {
          return State.SUCCESS
        }

        break

      case ERR_NOT_IN_RANGE:
        new Move(actor, target).execute()

        break
    }

    return State.RUNNING
  }

  findRoom() {
    const actor = this.actor
    const targetFinder = this.targetFinder
    const targetTypes = this.targetTypes

    const rooms = actor.room.prioritize(World.myRooms)

    const room = _.find(rooms, function (room) {
      const targets = targetFinder.find(room, targetTypes)

      return targets.length > 0
    })

    return room
  }

  get targetTypes() {
    const role = this.role
    const state = this.name

    let targetTypes = []

    switch (true) {
      case !_.isUndefined(role.findTargetTypes):
        targetTypes = role.findTargetTypes(state)

        break

      default:
        targetTypes = [
          [
            FIND_MY_SPAWNS,
            FIND_EXTENSIONS,
            FIND_TOWERS,
          ],
          [
            FIND_CONTROLLER_CONTAINER,
          ],
          [
            FIND_STORAGE,
          ],
        ]

        break
    }

    return targetTypes
  }

  findTarget(room) {
    const actor = this.actor
    const targetFinder = this.targetFinder
    const targetTypes = this.targetTypes

    const targets = targetFinder.find(room, targetTypes)
    const target = room !== actor.room ? targets[0] : actor.pos.findClosestByRange(targets)

    return target
  }

  handleAction() {
    const actor = this.actor
    const target = actor.target
    const resource = this.role.resource

    const actionResult = new Transfer(actor, target, resource).execute()
    const targetFreeCapacity = target.store.getFreeCapacity(resource)

    switch (actionResult) {
      case OK:
        // change state if all carried resources are transferred
        if (targetFreeCapacity >= actor.store.getUsedCapacity(resource)) {
          return State.SUCCESS
        }

        return State.RUNNING

      case ERR_BUSY:
      case ERR_NOT_IN_RANGE:
        return State.RUNNING

      case ERR_FULL:
      case ERR_NOT_ENOUGH_RESOURCES:
        return State.SUCCESS

      case ERR_INVALID_TARGET:
        this.changeTarget(actor, null)
        return State.RUNNING

      case ERR_INVALID_ARGS:
      case ERR_NO_BODYPART:
      case ERR_NOT_OWNER:
        return State.FAILED

      default:
        console.log('DISTRIBUTING', 'unhandled action result', actionResult)
        return State.FAILED
    }
  }
}

global.Distributing = Distributing
