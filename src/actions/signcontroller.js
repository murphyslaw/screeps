'use strict'

class SignController extends Action {
  constructor(actor, target, text) {
    super()

    this.actor = actor
    this.target = target
    this.text = text
  }

  update() {
    return this.actor.signController(this.target, this.text)
  }
}

global.SignController = SignController
