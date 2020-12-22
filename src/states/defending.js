'use strict'

global.Defending = class extends State {
  get state() { return states.DEFENDING }

  findRoom() {
    const room = _.find(World.territory, 'underAttack')

    return room ? room.name : null
  }

  findTarget() {
    return this.actor.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
  }

  handleAction() {
    let result = State.RUNNING

    const actionResult = new Attack(this.actor, this.target).update()

    switch (actionResult) {
      case OK:
        result = State.RUNNING
        break
      default:
        result = State.FAILED
        break
    }

    if (!_.some(World.territory, 'underAttack')) {
      result = State.SUCCESS
    }

    return result
  }
}
