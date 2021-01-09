'use strict'

class Recycle extends Action {
  constructor(actor, spawn) {
    super()

    this.actor = actor
    this.spawn = spawn
  }

  execute() {
    return this.spawn.recycleCreep(this.actor)
  }
}

global.Recycle = Recycle
