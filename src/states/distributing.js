'use strict'

class Distributing extends State {
  get icon() { return '🚚' }
  get validator() { return new EmptyingTargetValidator(this.role) }

  findRoom() {
    const actor = this.actor
    const rooms = actor.room.prioritize(World.myRooms)

    let room = _.find(rooms, function (room) {
      const targets = room.findWithPriorities(
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

  get structurePriorities() {
    return [
      STRUCTURE_SPAWN,
      STRUCTURE_EXTENSION,
      STRUCTURE_TOWER,
      STRUCTURE_CONTAINER,
      STRUCTURE_STORAGE,
    ]
  }

  findTarget(room) {
    const role = this.role
    const actor = this.actor
    const state = this.state

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

    const targets = this.targetFinder.find(room, targetTypes)
    const target = room !== actor.room ? targets[0] : actor.pos.findClosestByRange(targets)

    return target
  }

  handleAction() {
    const actor = this.actor
    const target = actor.target
    const resource = this.role.resource

    const actionResult = new Transfer(actor, target, resource).update()

    switch (actionResult) {
      case OK:
        // only change state if all carried resources are transferred
        if (this.target.store.getFreeCapacity(resource) >= actor.store.getUsedCapacity(resource)) {
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
        actor.target = null
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
