'use strict'

global.Signing = class extends State {
  findRoom() {
    const room = _.find(World.myRooms, 'needsSigner')

    return room ? room.name : null
  }

  findTarget() {
    const controller = this.room.controller

    if (controller && Signing.text !== controller.sign) return controller

    return null
  }

  handleAction() {
    const actionResult = new SignController(this.actor, this.target, Signing.text).update()

    switch (actionResult) {
      case OK:
        return [State.SUCCESS, actionResult]

      case ERR_BUSY:
      case ERR_NOT_IN_RANGE:
        return [State.RUNNING, actionResult]

      case ERR_INVALID_TARGET:
        this.actor.target = null
        return [State.RUNNING, actionResult]

      default:
        console.log('SIGNING', 'unhandled action result', actionResult)
        return [State.FAILED, actionResult]
    }
  }
}

Signing.text = 'Anything that can go wrong, will go wrong.'
