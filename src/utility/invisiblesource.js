'use strict'

class InvisibleSource {
  constructor(room, id) {
    this.room = room
    this.id = id
  }

  get visible() {
    return false
  }

  get memory() {
    return this.room.memory.sources[this.id] = this.room.memory.sources[this.id] || {}
  }

  get container() {
    if (!this._container) {
      if (this.memory.container) {
        this._container = new InvisibleContainer(this.room, this.memory.container)
      }
    }

    return this._container
  }

  toString() {
    return '[isource ' + this.id + ']'
  }
}

global.InvisibleSource = InvisibleSource
