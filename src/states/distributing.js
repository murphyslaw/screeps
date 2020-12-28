'use strict'

class Distributing extends State {
  findRoom() {
    // prioritize current room
    const rooms = World.territory
    const currentRoom = this.actor.room
    const index = rooms.indexOf(currentRoom)

    if (index > 0) {
      rooms.splice(index, 1)
      rooms.unshift(currentRoom)
    }

    const room = rooms[0]

    return room ? room.name : null
  }

  validTarget(target, exclusive = false) {
    if (!target) return false

    let validTarget = false
    let targetFreeCapacity = 0

    if (target.store) {
      targetFreeCapacity = target.store.getFreeCapacity(this.resource)
    }

    validTarget = targetFreeCapacity > 0

    if (validTarget && exclusive) {
      validTarget = !_.some(Game.creeps, 'target', target)
    }

    return validTarget
  }

  get structurePriorities() {
    return [
      STRUCTURE_SPAWN,
      STRUCTURE_EXTENSION,
      STRUCTURE_TOWER,
      STRUCTURE_CONTAINER,
      STRUCTURE_STORAGE,
    ]
  }

  findTarget() {
    let targets = []

    if (!targets.length) {
      const spawns = _.filter(this.room.spawns, target => this.validTarget(target))
      targets.push(...spawns)

      const extensions = _.filter(this.room.extensions, target => this.validTarget(target))
      targets.push(...extensions)
    }

    if (!targets.length) {
      const towers = _.filter(this.room.towers, target => this.validTarget(target))
      targets.push(...towers)
    }

    if (!targets.length) {
      let target

      target = this.room.controllerContainer
      if (target && this.validTarget(target)) {
        targets.push(target)
      }

      target = this.room.storage
      if (target && this.validTarget(target)) {
        targets.push(target)
      }
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
    const actionResult = new Transfer(this.actor, this.target, this.resource).update()

    switch (actionResult) {
      case OK:
        // only change state if all carried resources are transferred
        if (this.target.store.getFreeCapacity(this.resource) >= this.actor.store.getUsedCapacity(this.resource)) {
          // this.actor.moveTo(13, 34)
          return State.SUCCESS
        }

        return State.RUNNING

      case ERR_NOT_ENOUGH_RESOURCES:
        return State.SUCCESS

      case ERR_BUSY:
      case ERR_NOT_IN_RANGE:
        return State.RUNNING

      case ERR_FULL:
        // this.actor.moveTo(13, 34)
        // this.actor.target = null
        return State.SUCCESS

      case ERR_INVALID_TARGET:
        this.actor.target = null
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
