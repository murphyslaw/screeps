'use strict'

class Creepy extends Role {
  get name() { return this.constructor.name }
  get startState() { return 'Spawning' }
  get resource() { return RESOURCE_ENERGY }

  nextState(context) { throw Error('not implemented') }

  update() {
    const actor = this.actor
    let state = actor.state

    if (!state) {
      state = actor.state = this.startState
    }

    const stateClass = global[state]

    if (stateClass) {
      const stateInstance = new stateClass(state, this)
      let nextState = stateInstance.run()

      if (actor.state !== nextState) {
        stateInstance.exit()
        nextState = new global[nextState](nextState, this).enter()
      }

      actor.state = nextState
    } else {
      this.logger.debug('CREEPY', 'unhandled state', state, actor.role, actor, actor.pos)
    }
  }
}

global.Creepy = Creepy
