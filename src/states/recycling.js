'use strict'

global.Recycling = class extends State {
  get state() { return states.RECYCLING }

  get room() {
    let roomName

    roomName = this.actor.destination && this.actor.destination.roomName
    roomName = roomName || World.myRooms[0].name

    return World.getRoom(roomName)
  }

  get target() {
    let target

    target = this.actor.target
    target = target || this.room.spawns[0]

    return target
  }

  handleAction() {
    let result = State.RUNNING

    const actionResult = new Recycle(this.actor, this.target).update()

    switch (actionResult) {
      case OK:
        result = State.SUCCESS
        break
      default:
        result = State.FAILED
        break
    }

    return result
  }
}
