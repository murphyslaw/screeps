'use strict'

class InvisibleContainer {
  constructor(room, id) {
    this.room = room
    this.id = id
  }

  get visible() {
    return false
  }

  toString() {
    return '[istructure (container) ' + this.id + ']'
  }
}

global.InvisibleContainer = InvisibleContainer
