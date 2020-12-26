'use strict'

class StateMachine {
  constructor(actor) {
    this.actor = actor
  }

  get memory() {
    return this.actor.memory
  }

  get startState() {
    return 'Spawning'
  }

  get currentState() {
    const state = this.memory.currentState || this.startState
    return new global[state](this.actor)
  }

  set currentState(state) {
    this.memory.currentState = state.name
  }

  get previousState() {
    const state = this.memory.previousState || this.startState
    return new global[state](this.actor)
  }

  set previousState(state) {
    this.memory.previousState = state.name
  }

  update() {
    this.currentState.update()
  }

  changeState(nextState) {
    this.previousState = this.currentState
    this.currentState.exit()
    this.currentState = nextState
    this.currentState.enter()
  }

  revertState() {
    this.changeState(this.previousState)
  }
}

global.StateMachine = StateMachine
