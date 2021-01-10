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
    const roomMemory = this.room.memory.mineral

    roomMemory.mineral = roomMemory.mineral || {}

    return roomMemory.mineral
  }

  get container() {
    if (!this._container) {
      const memory = this.memory

      if (memory.container) {
        const room = this.room

        this._container = new InvisibleContainer(room, memory.container)
      }
    }

    return this._container
  }

  toString() {
    return '[imineral ' + this.id + ']'
  }
}

global.InvisibleMineral = InvisibleMineral
