'use strict'

class Creepy extends Role {
  get name() { return this.constructor.name }
  get startState() { return 'Spawning' }

  nextState(context) { throw Error('not implemented') }

  update(actor) {
    let state = actor.state

    if (!state) {
      state = actor.state = this.startState
    }

    const stateClass = global[state]

    if (stateClass) {
      const stateInstance = new stateClass(state, actor, this)
      const nextState = stateInstance.run()

      if (actor.state !== nextState) stateInstance.exit()

      actor.state = nextState
    } else {
      this.logger.debug('CREEPY', 'unhandled state', actor, actor.role, state)
    }
  }
}

global.Creepy = Creepy
