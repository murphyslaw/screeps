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

    let room = _.find(rooms, function(room) {
      const targets = room.findWithPriorities(
        FIND_STRUCTURES,
        this.structurePriorities,
        structure => this.validTarget(structure)
      )

      return targets.length > 0
    }, this)

    if (!room) {
      room = this.actor.room
    }

    return room.name
  }

  validTarget(target, exclusive = false) {
    if (!target) return false

    const actorFreeCapacity = this.actor.store.getFreeCapacity(this.resource)
    let targetUsedCapacity = 0

    if (target.store) {
      targetUsedCapacity = target.store.getUsedCapacity(this.resource)
    } else if (target instanceof Resource) {
      targetUsedCapacity = target.amount
    } else if (target instanceof Source) {
      targetUsedCapacity = target.energy
    }

    let validTarget = false

    validTarget = targetUsedCapacity >= actorFreeCapacity

    if (validTarget && exclusive) {
      validTarget = !_.some(Game.creeps, 'target', target)
    }

    return validTarget
  }

  get structurePriorities() {
    return [
      STRUCTURE_STORAGE,
      STRUCTURE_CONTAINER,
    ]
  }

  findTarget() {
    let targets = []

    if ('Upgrader' === this.actor.role) {
      if (!targets.length) {
        const target = this.room.controllerContainer
        if (target && this.validTarget(target)) {
          targets.push(target)
        }
      }
    }

    if (!targets.length) {
      const dropped = this.room.find(FIND_DROPPED_RESOURCES, {
        filter: target => this.validTarget(target, true)
      })

      targets.push(...dropped)

      const tombstones = this.room.find(FIND_TOMBSTONES, {
        filter: target => this.validTarget(target, true)
      })

      targets.push(...tombstones)

      const ruins = this.room.find(FIND_RUINS, {
        filter: target => this.validTarget(target, true)
      })

      targets.push(...ruins)

      if ('Hauler' !== this.actor.role) {
        const storage = this.room.storage
        if (storage) targets.push(storage)

        const containers = _.filter(this.room.containers, target => this.validTarget(target))
        targets.push(...containers)
      }
    }

    if ('Hauler' === this.actor.role) {
      if (!targets.length) {
        targets = _.filter(this.room.sourceContainers, target => this.validTarget(target))
      }

      return this.actor.pos.findClosestByRange(targets)
    }

    if (!targets.length) {
      targets = _.filter(this.room.sources, target => this.validTarget(target) && target.vacancies())
    }

    return this.actor.pos.findClosestByRange(targets)
  }

  get resource() {
    switch(this.actor.role) {
      case 'Scorer':
      case 'ScoreHarvester':
        return RESOURCE_SCORE
      default:
        return RESOURCE_ENERGY
    }
  }

  handleAction() {
    const target = this.target
    const actor = this.actor
    const resource = this.resource
    let actionResult
    let targetResources = 0

    if (target instanceof Source) {
      actionResult = new Harvest(actor, target).update()
      targetResources = HARVEST_POWER * actor.getActiveBodyparts(WORK)
    } else if(target instanceof Resource) {
      actionResult = new Pickup(actor, target).update()
      targetResources = target.amount
    } else {
      actionResult = new Withdraw(actor, target, resource).update()
      targetResources = target.store.getUsedCapacity(resource)
    }

    switch (actionResult) {
      case OK:
        if (targetResources >= actor.store.getFreeCapacity(resource)) {
          // actor.target = null
          // if (actor.memory._move) {
          //   const path = Room.deserializePath(actor.memory._move.path)
          //   const lastDirection = path[0].direction
          //   const oppositeDirection = (lastDirection % 8) + 4
          //   actor.move(oppositeDirection)
          //   // actor.moveTo(13, 34)
          //   console.log('turn around')
          // } else {
          //   actor.moveTo(13, 34)
          // }

          return State.SUCCESS
        }

        return State.RUNNING

      case ERR_FULL:
        // actor.moveTo(13, 34)
        return State.SUCCESS

      case ERR_BUSY:
      case ERR_NOT_IN_RANGE:
        return State.RUNNING

      case ERR_NOT_ENOUGH_RESOURCES:
      case ERR_INVALID_TARGET:
        actor.target = null
        // actor.destination = null
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
