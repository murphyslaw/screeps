'use strict'

class InvisibleMineral {
  constructor(room, id) {
    this.room = room
    this.id = id
  }

  get visible() {
    return false
  }

  get memory() {
    return this.room.memory.minerals[this.id] = this.room.memory.minerals[this.id] || {}
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
    return '[imineral ' + this.id + ']'
  }
}

global.InvisibleMineral = InvisibleMineral
