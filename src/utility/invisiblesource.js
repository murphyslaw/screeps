'use strict'

class InvisibleSource {
  constructor(room, id) {
    this.room = room
    this.id = id
  }

  get invisible() {
    return true
  }

  get memory() {
    return this.room.memory.sources[this.id] = this.room.memory.sources[this.id] || {}
  }

  get container() {
    if (!this._container) {
      this._container = this.memory.container
    }

    return this._container
  }

  toString() {
    return '[isource ' + this.id + ']'
  }
}

global.InvisibleSource = InvisibleSource
