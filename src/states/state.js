'use strict'

class State {
  constructor(state, role) {
    this.state = state
    this.role = role
    this.actor = role.actor
    this.nextState = role.nextState
    this.logger = new Logger('State')
  }

  get icon() { return '➰' }
  get validator() { return new NullValidator() }
  get targetFinder() { return new TargetFinder(this.validator) }
  get context() { return { currentState: this.state } }

  get room() {
    let roomName

    roomName = this.actor.destination && this.actor.destination.roomName
    roomName = roomName || this.findRoom()

    return World.getRoom(roomName)
  }

  findRoom() { return this.actor.room.name }

  get target() {
    let target

    target = this.actor.target
    target = this.validator.isValid(target) ? target : null
    target = target || this.findTarget(this.room)

    return target
  }

  findTarget(room) { return this.actor }

  get destination() {
    const target = this.actor.target || this.target
    const destination = this.targetBasedDestination(target)

    return destination
  }

  targetBasedDestination(target) { return target }

  findDestinationRoomPosition(room) {
    let destination

    // use the targets position if possible as a more precise goal in the destination room
    const target = this.actor.target
    if (target && target.room.name === room.name) {
      destination = this.targetBasedDestination(target)
    } else {
      destination = new RoomPosition(25, 25, room.name)
    }

    return destination
  }

  run() {
    let context = this.context
    const room = this.room
    const actor = this.actor

    if (!room) {
      context.result = State.FAILED
      return this.nextState(context)
    }

    if (actor.room !== room && room.invisible) {
      this.changeTarget(actor, null, this.findDestinationRoomPosition(room))

      context.result = this.handleMovement()
      return this.nextState(context)
    }

    const target = this.target

    if (!target) {
      this.changeTarget(actor, null)

      context.result = State.RUNNING
      return this.nextState(context)
    }

    if (actor.target !== target) {
      this.changeTarget(actor, target)
    }

    // execute the state action only if the actor
    // already transitioned
    if (actor.state === this.state) {
      context.result = this.handleAction()

      if (State.RUNNING !== context.result) {
        return this.nextState(context)
      }
    }

    context.result = this.handleMovement()
    return this.nextState(context)
  }

  changeTarget(actor, target, destination) {
    actor.target = target
    actor.destination = destination || this.targetBasedDestination(target)
  }

  handleAction() { throw Error('not implemented') }

  handleMovement() {
    const actor = this.actor
    const destination = actor.destination || actor.pos

    if (!actor.pos.inRangeTo(destination, this.validRange)) {
      const actionResult = new Move(actor, destination, this.movementOptions).update()

      switch (actionResult) {
        case OK:
        case ERR_BUSY:
        case ERR_TIRED:
          return State.RUNNING

        case ERR_NO_PATH:
        case ERR_INVALID_TARGET:
          this.changeTarget(actor, null)
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

  enter() {
    new Say(this.actor, this.icon).update()

    return this.run()
  }

  exit() {
    this.changeTarget(this.actor, null)
  }
}

// return codes
State.SUCCESS = 0
State.RUNNING = 1
State.FAILED = -1

global.State = State
