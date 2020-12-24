'use strict'

global.Recycling = class extends State {
  findRoom() {
    const spawnRooms = World.spawnRooms

    return spawnRooms.length ? spawnRooms[0].name : null
  }

  findTarget() {
    return this.room.spawns[0]
  }

  handleAction() {
    const actionResult = new Recycle(this.actor, this.target).update()

    switch (actionResult) {
      case OK:
        return [State.SUCCESS, actionResult]

      case ERR_NOT_IN_RANGE:
        return [State.RUNNING, actionResult]

      case ERR_RCL_NOT_ENOUGH:
      case ERR_INVALID_TARGET:
      case ERR_NO_BODYPART:
      case ERR_NOT_OWNER:
        return [State.FAILED, actionResult]

      default:
        console.log('RECYCLING', 'unhandled action result', actionResult)
        return [State.FAILED, actionResult]
    }
  }
}
