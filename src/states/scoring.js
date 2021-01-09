'use strict'

class Scoring extends State {
  get icon() { return '🏆' }

  findRoom() {
    const room = World.getRoom('E20N30')

    return room
  }

  findTarget(room) {
    const actor = this.actor
    const targetFinder = this.targetFinder
    const targetTypes = this.targetTypes

    const targets = targetFinder.find(room, targetTypes)
    const target = room !== actor.room ? _.first(targets) : actor.pos.findClosestByRange(targets)

    return target
  }

  get targetTypes() {
    return [
      FIND_SCORE_COLLECTORS,
    ]
  }

  handleAction() {
    const actor = this.actor
    const target = this.actor.target

    const actionResult = new Score(actor, target).execute()

    switch (actionResult) {
      case OK:
        return State.SUCCESS

      case ERR_BUSY:
      case ERR_NOT_IN_RANGE:
        return State.RUNNING

      case ERR_FULL:
      case ERR_INVALID_TARGET:
        return State.RUNNING

      case ERR_NOT_ENOUGH_RESOURCES:
      case ERR_INVALID_ARGS:
      case ERR_NOT_OWNER:
        return State.FAILED

      default:
        console.log('SCORING', 'unhandled action result', actionResult)
        return State.FAILED
    }
  }
}

global.Scoring = Scoring
