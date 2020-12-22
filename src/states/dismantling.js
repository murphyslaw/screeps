'use strict'

global.Dismantling = class extends State {
  get state() { return states.DISMANTLING }

  findRoom() {
    return 'W20N30'
  }

  findTarget() {
    const roomName = this.room.name
    const monument = new Monument(roomName)
    const start = new RoomPosition(38, 27, roomName)
    const target = monument.blocker(start)

    return target
  }

  handleAction() {
    let result = State.RUNNING

    const actionResult = new Dismantle(this.actor, this.target).update()

    switch (actionResult) {
      case OK:
        result = State.RUNNING
        break
      default:
        result = State.FAILED
        break
    }

    return result
  }
}
