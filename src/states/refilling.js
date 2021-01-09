'use strict'

class Refilling extends State {
  get icon() { return '⚡' }
  get validator() { return new FillingTargetValidator(this.role) }

  findRoom() {
    const rooms = this.rooms
    const targetFinder = this.targetFinder
    const targetTypes = this.targetTypes

    const room = _.find(rooms, function (room) {
      const targets = targetFinder.find(room, targetTypes)

      return targets.length > 0
    }, this)

    return room
  }

  get rooms() {
    const actor = this.actor
    const role = this.role

    let rooms
    rooms = !_.isUndefined(role.rooms) && role.rooms
    rooms = rooms || actor.room.prioritize(World.territory)

    return rooms
  }

  get targetTypes() {
    const role = this.role
    const name = this.name

    let targetTypes = []

    switch (true) {
      case !_.isUndefined(role.findTargetTypes):
        targetTypes = role.findTargetTypes(name)

        break

      default:
        targetTypes = [
          [
            FIND_DROPPED_RESOURCES,
            FIND_TOMBSTONES,
            FIND_RUINS,
          ],
          [
            FIND_STORAGE,
          ],
          [
            FIND_CONTAINERS,
            FIND_SOURCES_ACTIVE,
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
    const target = room !== actor.room ? _.first(targets) : actor.pos.findClosestByRange(targets)

    return target
  }

  handleAction() {
    const actor = this.actor
    const target = actor.target
    let actionResult
    let targetResources = 0

    switch(true) {
      case target instanceof Resource:
        actionResult = new Pickup(actor, target).execute()
        targetResources = target.amount
        break

      case target instanceof Source:
        actionResult = new Harvest(actor, target).execute()
        targetResources = HARVEST_POWER * actor.getActiveBodyparts(WORK)
        break

      case !_.isUndefined(target.store):
        const role = this.role
        const storedResourceTypes = target.store.resources
        const resourceType = role.resource || _.first(storedResourceTypes)

        actionResult = new Withdraw(actor, target, resourceType).execute()
        targetResources = target.store.getUsedCapacity(resourceType)

        break
    }

    switch (actionResult) {
      case OK:
        if (targetResources >= actor.store.getFreeCapacity()) {
          return State.SUCCESS
        }

        return State.RUNNING

      case ERR_FULL:
        return State.SUCCESS

      case ERR_BUSY:
      case ERR_NOT_IN_RANGE:
        return State.RUNNING

      case ERR_NOT_ENOUGH_RESOURCES:
      case ERR_INVALID_TARGET:
        actor.target = null
        return State.RUNNING

      case ERR_INVALID_ARGS:
      case ERR_NO_BODYPART:
      case ERR_NOT_OWNER:
        return State.FAILED

      default:
        console.log('REFILLING', 'unhandled action result', actionResult, actor.role)
        return State.FAILED
    }
  }
}

global.Refilling = Refilling
