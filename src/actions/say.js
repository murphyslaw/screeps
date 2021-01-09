'use strict'

class Say extends Action {
  constructor(actor, message) {
    super()

    this.actor = actor
    this.message = message
  }

  execute() {
    return this.actor.say(this.message)
  }
}

global.Say = Say
