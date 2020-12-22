'use strict'

global.states = {
  INITIALIZING: 0,
  REFILLING: 2,
  WORKING: 3,
  MOVING: 4,
  SIGNING: 5,
  DISMANTLING: 6,
  DEFENDING: 7,
  HEALING: 8,
  RECYCLING: 9,
  SCORING: 10,
}

global.State = class {
  constructor(actor, nextState) {
    this.actor = actor
    this.nextState = nextState
  }

  get state() { throw Error('not implemented') }
  get context() { return { actor: this.actor, currentState: this.state } }

  get room() {
    let roomName

    roomName = this.actor.destination && this.actor.destination.roomName
    roomName = roomName || this.findRoom()

    return World.getRoom(roomName)
  }

  get target() {
    let target

    target = this.actor.target
    target = target || this.findTarget()

    return target
  }

  run() {
    let stateResult = State.SUCCESS
    let context = this.context

    // handle target
    if (State.FAILED !== stateResult) {
      stateResult = this.handleTarget()
    }

    // handle movement
    if (State.FAILED !== stateResult) {
      stateResult = this.handleMovement()
    }

    // handle action
    if (State.SUCCESS === stateResult) {
      stateResult = this.handleAction()
    }

    // provide context for decider
    context.result = stateResult

    // transition to next state with the given context
    return this.nextState(context)
  }

  handleTarget() {
    const room = this.room

    if (!room) return State.FAILED
    if (!this.actor.inDestinationRoom) {
      this.actor.destination = new RoomPosition(25, 25, room.name)
      return State.RUNNING
    }

    const target = this.target

    if (!target) return State.FAILED

    this.actor.destination = target
    this.actor.target = target

    return State.RUNNING
  }

  handleMovement() {
    let result = State.SUCCESS

    if (!this.actor.pos.isNearTo(this.actor.destination)) {
      const actionResult = new Move(this.actor, this.actor.destination, {}).update()

      switch (actionResult) {
        case OK:
          result = State.RUNNING
          break
        default:
          result = State.FAILED
          break
      }
    }

    return result
  }

  handleAction() { throw Error('not implemented') }

  exit() {
    this.actor.destination = null
    this.actor.target = null
  }
}

// return codes
State.SUCCESS = 0
State.RUNNING = 1
State.FAILED = -1
