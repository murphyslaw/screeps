'use strict'

class State {
  constructor(role) {
    this.role = role
    this.actor = role.actor
    this.name = this.constructor.name
    this.targetFinder = new TargetFinder(this.validator)
    this.context = { currentState: this.name }
    this.logger = new Logger('State')
  }

  get icon() { return '❓' }
  get validator() { return new NullValidator() }

  get room() {
    const roomName = this.actor.destination && this.actor.destination.roomName
    const room = roomName && World.getRoom(roomName) || this.findRoom()

    return room
  }

  findRoom() { return this.actor.room }

  get target() {
    const actor = this.actor
    const room = this.room
    const validator = this.validator
    let target

    target = actor.target
    target = validator.isValid(target) ? target : null
    target = target || this.findTarget(room)

    return target
  }

  findTarget(room) { return this.actor }

  targetBasedDestination(target) { return target }

  update() {
    const room = this.room
    const actor = this.actor
    let result

    if (!room) {
      return State.FAILED
    }

    if (room !== actor.room && !room.visible) {
      this.changeTarget(actor, null, room.center)

      result = this.handleMovement()
      return result
    }

    const target = this.target

    if (!target) {
      this.changeTarget(actor, null)

      return State.RUNNING
    }

    if (actor.target !== target) {
      this.changeTarget(actor, target)
    }

    result = this.handleAction()

    if (State.RUNNING !== result) {
      return result
    }

    result = this.handleMovement()
    return result
  }

  changeTarget(actor, target, destination) {
    actor.target = target
    actor.destination = destination || this.targetBasedDestination(target)
  }

  handleAction() { throw Error('not implemented') }

  handleMovement() {
    const actor = this.actor
    const destination = actor.destination
    const options = this.movementOptions
    const range = this.validRange

    if (destination && !actor.pos.inRangeTo(destination, range)) {
      const actionResult = new Move(actor, destination, options).execute()

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
    new Say(this.actor, this.icon).execute()
  }

  exit() {
    this.changeTarget(this.actor, null)
  }
}

State.SUCCESS = 0
State.RUNNING = 1
State.FAILED = -1

global.State = State
