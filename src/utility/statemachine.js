'use strict'

class StateMachine {
  constructor(actor) {
    this.actor = actor
  }

  get memory() { return this.actor.memory }
  get startState() { return 'Spawning' }

  get currentState() {
    if (!this._currentState) {
      if (!this.memory.currentState) {
        this.memory.currentState = this.startState
      }

      this._currentState = this.state(this.memory.currentState)
    }

    return this._currentState
  }

  set currentState(state) {
    this.memory.currentState = state.name
  }

  get previousState() {
    if (!this._previousState) {
      if (!this.memory.previousState) {
        this.memory.previousState = this.startState
      }

      this._previousState = this.state(this.memory.previousState)
    }

    return this._previousState
  }

  set previousState(state) {
    this.memory.previousState = state.name
  }

  update() {
    const currentState = this.currentState
    const result = currentState.update()
    const nextState = this.transition(currentState, result)

    if (currentState.name !== nextState.name) {
      this.changeState(nextState)
    }

    return
  }

  changeState(nextState) {
    this.previousState = this.currentState
    this.currentState.exit()
    this.currentState = nextState
    this.currentState.enter()
  }

  transition(currentState, result) {
    const transitions = this.actor.transitions
    const currentStateName = currentState.name
    const transition = _.get(transitions, [currentStateName, result], currentStateName)

    let nextStateName

    switch(true) {
      case _.isString(transition):
        nextStateName = transition
        break

      case _.isFunction(transition):
        nextStateName = transition()
        break
    }

    return this.state(nextStateName)
  }

  revertState() {
    this.changeState(this.previousState)
  }

  state(name) {
    return new global[name](this.actor)
  }
}

global.StateMachine = StateMachine
