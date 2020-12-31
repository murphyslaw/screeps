'use strict'

class InvisibleContainer {
  constructor(room, id) {
    this.room = room
    this.id = id
  }

  get invisible() {
    return true
  }

  toString() {
    return '[istructure (container) ' + this.id + ']'
  }
}

global.InvisibleContainer = InvisibleContainer
