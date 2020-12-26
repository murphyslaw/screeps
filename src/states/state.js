'use strict'

class State {
  constructor(state, actor, role) {
    this.state = state
    this.actor = actor
    this.role = role
    this.nextState = role.nextState
    this.logger = new Logger('State')
    if (this.actor.role === 'builder') this.logger.debug('state', 'constructor', this.actor.destination, this.actor.target)
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

  get target() {
    let target

    target = this.actor.target
    target = this.validateTarget(target)
    target = target || this.findTarget()

    return target
  }

  validateTarget(target) { return target }
  findTarget() {}

  run() {
    if (this.actor.role === 'builder') this.logger.debug('state', 'run', this.actor.pos, this.actor.destination, this.actor.target, this.actor.target && this.actor.target.pos)
    let context = this.context

    let [stateResult, stepResult] = this.handleTarget()
    if (this.actor.role === 'builder') this.logger.debug('state', 'run', 'handleTarget', stateResult, stepResult)


    if (State.RUNNING === stateResult && OK === stepResult) {
      [stateResult, stepResult] = this.handleAction()
      if (this.actor.role === 'builder') this.logger.debug('state', 'run', 'handleAction', stateResult, stepResult)
    }

    if (State.RUNNING === stateResult) {
      [stateResult, stepResult] = this.handleMovement()
      if (this.actor.role === 'builder') this.logger.debug('state', 'run', 'handleMovement', stateResult, stepResult)
    }

    context.result = stateResult

    return this.nextState(context)
  }

  handleTarget() {
    const room = this.room

    if (!room) {
      return [State.FAILED, ERR_INVALID_TARGET]
    }

    if (this.actor.room !== room) {
      let destination = new RoomPosition(25, 25, room.name)
      const target = this.actor.target

      if (target && target.pos.roomName === room.name) {
        destination = target.pos
      }

      this.actor.destination = destination

      return [State.RUNNING, ERR_NOT_IN_RANGE]
    }

    const target = this.target

    if (!target) {
      this.actor.destination = null
      return [State.RUNNING, ERR_INVALID_TARGET]
    }

    this.actor.destination = target
    this.actor.target = target

    return [State.RUNNING, OK]
  }

  handleAction() { throw Error('not implemented') }

  handleMovement() {
    if (!this.actor.destination) return [State.RUNNING, ERR_INVALID_TARGET]

    if (!this.actor.pos.inRangeTo(this.actor.destination, this.validRange)) {
      const actionResult = new Move(this.actor, this.actor.destination, this.movementOptions).update()

      switch (actionResult) {
        case OK:
        case ERR_BUSY:
        case ERR_TIRED:
          return [State.RUNNING, actionResult]

        case ERR_NO_PATH:
        case ERR_INVALID_TARGET:
          this.actor.destination = null
          this.actor.target = null
          return [State.RUNNING, actionResult]

        case ERR_NO_BODYPART:
        case ERR_NOT_OWNER:
        default:
          return [State.FAILED, actionResult]
      }
    }

    return [State.RUNNING, OK]
  }

  get validRange() { return 1 }
  get movementOptions() { return {} }

  enter() {}

  exit() {
    this.actor.destination = null
    this.actor.target = null
  }
}

// return codes
State.SUCCESS = 0
State.RUNNING = 1
State.FAILED = -1

global.State = State
