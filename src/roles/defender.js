'use strict'

global.Defender = class extends Creepy {
  get name() { return 'defender' }

  get bodyPattern() { return [TOUGH, TOUGH, ATTACK, ATTACK, MOVE, MOVE] }
  get maxCreepSize() { return this.bodyPattern.length * 4 }

  get states() {
    return {
      [states.INITIALIZING]: Initializing,
      [states.DEFENDING]: Defending,
      [states.MOVING]: Moving,
      [states.RECYCLING]: Recycling,
    }
  }

  number(room) {
    const underAttack = _.some(Memory.rooms, 'underAttack')

    return underAttack ? 1 : 0
  }

  nextState(actor, state, context) {
    let nextState = state

    switch(state) {
      case states.INITIALIZING:
        if (!actor.spawning) {
          let roomName = this.actor.pos.roomName

          _.forEach(Memory.rooms, function (room, name) {
            if (room.underAttack) {
              roomName = name
              return
            }
          })

          actor.destination = new RoomPosition(25, 25, roomName)
          nextState = states.MOVING
        }

        break
      case states.DEFENDING:
        if (ERR_NOT_IN_RANGE === context.result) {
          actor.destination = context.target
          nextState = states.MOVING
          break
        }

        if (ERR_INVALID_TARGET === context.result) {
          nextState = states.RECYCLING
          break
        }

        break
      case states.MOVING:
        if (ERR_INVALID_TARGET === context.result) {
          nextState = states.RECYCLING
          break
        }

        if (actor.inDestinationRoom && !actor.target) {
          nextState = states.DEFENDING
          break
        }

        if (actor.pos.isNearTo(destination)) {
          switch (actor.target.structureType) {
            case STRUCTURE_SPAWN:
              nextState = states.RECYCLING
              break
            default:
              nextState = states.DEFENDING
              break
          }

          break
        }

        break
      case states.RECYCLING:
        if (ERR_NOT_IN_RANGE === context.result) {
          actor.destination = context.spawn
          nextState = states.MOVING
          break
        }

        break
      default:
        console.log('SIGNER', 'unhandled state', state, JSON.stringify(context))
        break
    }

    return nextState
  }
}
