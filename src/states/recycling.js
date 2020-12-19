'use strict'

global.Recycling = class extends global.State {
  get spawn() {
    if (!this._spawn) {
      const spawn = Game.spawns['Spawn1']

      this._spawn = spawn
    }

    return this._spawn
  }

  run() {
    console.log('STATE', 'RECYCLING', 'RUN')

    let result = OK
    let context = {}

    // check prerequisites
    if (false) {}

    // execute action
    if (OK === result) {
      const action = new Recycle(this.actor, this.spawn)
      result = action.update()
    }

    // provide context for decider
    context.result = result

    switch (result) {
      case ERR_NOT_IN_RANGE:
        context.spawn = this.spawn
        break
    }

    // transition to next state with the given context
    return this.nextState(this.actor, states.RECYCLING, context)
  }
}
