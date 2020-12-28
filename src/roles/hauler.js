'use strict'

class Hauler extends Creepy {
  get bodyPattern() { return [CARRY, MOVE] }
  get maxCreepSize() { return this.bodyPattern.length * 6 }

  number(room) {
    if (!room.sourceContainers.length) return 0

    let number = room.sourceContainers.length

    if (room.mineral && room.mineral.container) {
      number += 1
    }

    return number
  }

  nextState(context) {
    const actor = context.actor
    const result = context.result
    const currentState = context.currentState
    let nextState = context.currentState

    switch (currentState) {
      case 'Spawning':
        if (!actor.spawning) {
          nextState = 'Refilling'
          break
        }

        break
      case 'Refilling':
        if (State.SUCCESS === result) {
          nextState = 'Distributing'
          break
        }

        if (State.FAILED === result) {
          nextState = 'Recycling'
          break
        }

        break
      case 'Distributing':
        if (State.SUCCESS === result) {
          nextState = 'Refilling'
          break
        }

        if (State.FAILED === result) {
          nextState = 'Recycling'
          break
        }

        break
      case 'Recycling':
        break
      default:
        console.log('HAULER', 'unhandled state', currentState, JSON.stringify(context))
        break
    }

    return nextState
  }
}

global.Hauler = Hauler
