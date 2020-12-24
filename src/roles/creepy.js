'use strict'

class Creepy extends Role {
  get name() { return this.constructor.name.toLowerCase() }
  get startState() { return states.INITIALIZING }
  get states() {
    return {
      [states.INITIALIZING]: Initializing,
      [states.IDLE]: Idle,
      [states.REFILLING]: Refilling,
      [states.SIGNING]: Signing,
      [states.DISMANTLING]: Dismantling,
      [states.DEFENDING]: Defending,
      [states.HEALING]: Healing,
      [states.RECYCLING]: Recycling,
      [states.SCORING]: Scoring,
      [states.CLAIMING]: Claiming,
      [states.BUILDING]: Building,
      [states.REPAIRING]: Repairing,
      [states.COLLECTING]: Collecting,
      [states.STORING]: Storing,
    }
  }

  nextState(context) { throw Error('not implemented') }

  run(actor) {
    let state = actor.state

    if (!state) {
      state = actor.state = this.startState
    }

    const stateClass = this.states[state]

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
