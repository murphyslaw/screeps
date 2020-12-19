'use strict'

global.Initialize = class extends global.Action {
  constructor(actor) {
    super()

    this.actor = actor
  }

  update() {
    console.log(this.actor, 'initializes')

    return OK
  }
}
