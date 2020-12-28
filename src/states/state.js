'use strict'

class State {
  constructor(state, actor, role) {
    this.state = state
    this.actor = actor
    this.role = role
    this.nextState = role.nextState
    this.logger = new Logger('State')
  }

  get context() {
    return { actor: this.actor, currentState: this.state }
  }

  get room() {
    let roomName

    roomName = this.actor.destination && this.actor.destination.roomName
    roomName = roomName || this.findRoom()

    return World.getRoom(roomName)
  }

  findRoom() {}

  get target() {
    let target

    target = this.actor.target
    target = this.validTarget(target) ? target : null
    target = target || this.findTarget()

    return target
  }

  validTarget(target) { return true }
  findTarget() {}

  get destination() {
    let destination

    destination = this.targetBasedDestination(this.actor.target)
    destination = destination || this.findDestination()

    return destination
  }

  findDestination() {
    let destination

    destination = this.targetBasedDestination(this.target)

    return destination
  }

  targetBasedDestination(target) {
    return target
  }

  findDestinationRoomPosition(room) {
    let destination

    // use the targets position if possible as a more precise goal in the destination room
    const target = this.actor.target
    if (target && target.pos.roomName === room.name) {
      destination = this.targetBasedDestination(target)
    } else {
      destination = new RoomPosition(25, 25, room.name)
    }

    return destination
  }

  run() {
    let context = this.context
    const room = this.room

    if (!room) {
      context.result = State.FAILED
      return this.nextState(context)
    }

    if (this.actor.room !== room) {
      this.actor.destination = this.findDestinationRoomPosition(room)

      context.result = this.handleMovement()
      return this.nextState(context)
    }

    const target = this.target

    if (!target) {
      // try to find another room in the next tick
      this.actor.destination = null

      context.result = State.RUNNING
      return this.nextState(context)
    }

    if (this.actor.target !== target) {
      this.actor.target = target
      this.actor.destination = null
    }

    context.result = this.handleAction()

    if (State.RUNNING !== context.result) {
      return this.nextState(context)
    }

    this.actor.destination = this.destination
    context.result = this.handleMovement()
    return this.nextState(context)
  }

  handleAction() { throw Error('not implemented') }

  handleMovement() {
    const destination = this.destination

    if (!this.actor.pos.inRangeTo(destination, this.validRange)) {
      const actionResult = new Move(this.actor, destination, this.movementOptions).update()

      switch (actionResult) {
        case OK:
        case ERR_BUSY:
        case ERR_TIRED:
          return State.RUNNING

        case ERR_NO_PATH:
        case ERR_INVALID_TARGET:
          this.actor.target = null
          this.actor.destination = null
          return State.RUNNING

        case ERR_NO_BODYPART:
        case ERR_NOT_OWNER:
        default:
          return State.FAILED
      }
    }

    return State.RUNNING
  }

  get validRange() { return 1 }
  get movementOptions() { return {} }

  enter() {}

  exit() {
    this.actor.target = null
    this.actor.destination = null
  }
}

// return codes
State.SUCCESS = 0
State.RUNNING = 1
State.FAILED = -1

global.State = State
