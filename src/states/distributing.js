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
    if (!room) return null

    const actor = this.actor
    const targetFinder = this.targetFinder
    const targetTypes = this.targetTypes

    const targets = targetFinder.find(room, targetTypes)
    const target = room !== actor.room ? targets[0] : actor.pos.findClosestByRange(targets)

    return target
  }
}

global.Distributing = Distributing
