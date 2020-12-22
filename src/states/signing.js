'use strict'

global.Signing = class extends State {
  get state() { return states.SIGNING }

  findRoom() {
    return _.find(World.myRooms, 'needsSigner').name
  }

  findTarget() {
    this.room.controller
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
    if (Signing.text === target.sign) return State.FAILED

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

  handleAction() {
    let result = State.SUCCESS

    const actionResult = new Sign(this.actor, this.target, Signing.text).update()

    switch (actionResult) {
      case OK:
        result = State.SUCCESS
        break
      default:
        result = State.FAILED
        break
    }

    return result
  }
}

Signing.text = 'Anything that can go wrong, will go wrong.'
