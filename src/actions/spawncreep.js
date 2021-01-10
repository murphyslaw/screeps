'use strict'

class SpawnCreep extends Action {
  constructor(spawn, body, options = {}) {
    super()

    this.spawn = spawn
    this.body = body
    this.name = this.randomName
    this.options = options
  }

  execute() {
    return this.spawn.spawnCreep(this.body, this.name, this.options)
  }

  get randomName() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }
}

global.SpawnCreep = SpawnCreep
