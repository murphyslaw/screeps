'use strict'

class Refilling extends State {
  get icon() { return '⚡' }
  get validator() { return new FillingTargetValidator(this.role) }

  findRoom() {
    switch(this.actor.role) {
      case 'RemoteHauler': {
        const rooms = World.remoteRooms
        const room = _.find(rooms, room => _.some(room.sourceContainers, container => this.validator.isValid(container)))
        return room ? room.name : null
      }

      default: {
        const actor = this.actor
        const rooms = actor.room.prioritize(World.territory)

        const room = _.find(rooms, function (room) {
          let targets = []

          targets = room.findWithPriorities(
            FIND_STRUCTURES,
            this.structurePriorities,
            structure => this.validator.isValid(structure)
          )

          return targets.length > 0
        }, this)

        if (!room) {
          room = actor.room
        }

        return room.name
      }
    }
  }

  get structurePriorities() {
    return [
      STRUCTURE_STORAGE,
      STRUCTURE_CONTAINER,
    ]
  }

  findTarget(room) {
    let targetTypes = []

    switch(true) {
      case !_.isUndefined(this.role.findTargetTypes):
        targetTypes = this.role.findTargetTypes(this.state)

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
            FIND_CONTAINERS,
          ],
          [
            FIND_SOURCES_ACTIVE,
          ]
        ]

        break
    }

    const targets = this.targetFinder.find(room, targetTypes)

    return this.actor.pos.findClosestByRange(targets)
  }

  handleAction() {
    const actor = this.actor
    const target = actor.target
    const resource = this.role.resource
    let actionResult
    let targetResources = 0

    if (target.store) {
      actionResult = new Withdraw(actor, target, resource).update()
      targetResources = target.store.getUsedCapacity(resource)
    } else if (target instanceof Resource) {
      actionResult = new Pickup(actor, target).update()
      targetResources = target.amount
    } else if (target instanceof Source) {
      actionResult = new Harvest(actor, target).update()
      targetResources = HARVEST_POWER * actor.getActiveBodyparts(WORK)
    }

    switch (actionResult) {
      case OK:
        if (targetResources >= actor.store.getFreeCapacity(resource)) {
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
        console.log('REFILLING', 'unhandled action result', actionResult)
        return State.FAILED
    }
  }
}

global.Refilling = Refilling
