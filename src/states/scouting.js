'use strict'

class Scouting extends State {
  get icon() { return '🔍' }

  update() {
    const actor = this.actor

    if (!actor.memory.routeIndex) {
      actor.memory.routeIndex = 0
    }

    const route = ['E19N30', 'E18N30', 'E19N30', 'E19N29', 'E20N29', 'E20N28', 'E20N30', 'E21N30', 'E22N30', 'E20N30', 'E20N31', 'E20N32', 'E20N33', 'E20N34']
    let currentRouteIndex = actor.memory.routeIndex

    if (actor.room.name === route[currentRouteIndex]) {
      actor.scout()
      actor.memory.routeIndex = currentRouteIndex = (currentRouteIndex + 1) % route.length
    }

    const roomName = route[currentRouteIndex]
    const room = World.getRoom(roomName)

    new Move(actor, room.center).execute()

    return State.RUNNING
  }
}

global.Scouting = Scouting
