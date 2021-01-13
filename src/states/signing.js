'use strict'

class Signing extends State {
  get icon() { return '📜' }

  findRoom() {
    const actor = this.actor
    const room = _.find(actor.home.territory, 'needsSigner')

    return room
  }

  findTarget(room) {
    const controller = room.controller

    if (controller && Signing.text !== controller.sign) return controller

    return null
  }

  handleAction() {
    const actionResult = new SignController(this.actor, this.target, Signing.text).execute()

    switch (actionResult) {
      case OK:
        return State.SUCCESS

      case ERR_BUSY:
      case ERR_NOT_IN_RANGE:
        return State.RUNNING

      case ERR_INVALID_TARGET:
        this.actor.target = null
        return State.RUNNING

      default:
        console.log('SIGNING', 'unhandled action result', actionResult)
        return State.FAILED
    }
  }
}

Signing.text = 'Anything that can go wrong, will go wrong.'

global.Signing = Signing
