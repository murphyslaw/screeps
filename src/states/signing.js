'use strict'

global.Signing = class extends State {
  get controller() {
    if (!this._controller) {
      const controller = this.actor.room.controller

      if (controller && !controller.sign) {
        this._controller = controller
      }
    }

    return this._controller
  }

  run() {
    console.log('STATE', 'SIGNING', 'RUN')

    let result = OK
    let context = {}

    // check prerequisites
    if (!this.controller) { result = ERR_INVALID_TARGET }

    // execute action
    if (OK === result) {
      let action = new SignController(this.actor, this.controller, Signing.text)
      result = action.update()
    }

    // provide context for decider
    context.result = result

    switch (result) {
      case ERR_NOT_IN_RANGE:
        context.controller = this.controller
        break
    }

    // transition to next state with the given context
    return this.nextState(this.actor, states.SIGNING, context)
  }
}

Signing.text = 'Anything that can go wrong, will go wrong.'
