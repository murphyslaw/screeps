'use strict'

global.Recycle = class extends Action {
  constructor(actor, spawn) {
    super()

    this.actor = actor
    this.spawn = spawn
  }

  update() {
    return this.spawn.recycleCreep(this.actor)
  }
}
