'use strict'

global.Recycle = class extends Action {
  constructor(actor, spawn) {
    super()

    this.actor = actor
    this.spawn = spawn
  }

  update() {
    console.log(this.spawn, 'recycles', this.actor)

    return this.spawn.recycleCreep(this.actor)
  }
}
