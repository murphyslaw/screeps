'use strict'

global.states = {
  INITIALIZING: 0,
  REFILLING: 2,
  WORKING: 3,
  MOVING: 4,
  SIGNING: 5,
  DISMANTLING: 6,
  RECYCLING: 9,
}

global.State = class {
  constructor(actor, nextState) {
    this.actor = actor
    this.nextState = nextState
  }
}
