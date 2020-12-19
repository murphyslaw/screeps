'use strict'

global.MonumentPathFinder = class {
  get options() {
    return {
      plainCost: 2,
      swampCost: 10,
      roomCallback: this.roomCallback,
    }
  }

  search(start, goal) {
    goal = { pos: goal, range: 1 }
    const result = PathFinder.search(start, goal, this.options)

    return result
  }

  roomCallback(roomName) {
    const room = Game.rooms[roomName]
    if (!room) return
    if (!room.scoreCollector) return

    const costs = new PathFinder.CostMatrix

    const positions = room.scoreCollector.pos.neighbors(WALLS_RADIUS)
    positions.forEach(function (position) {
      const structure = position.lookFor(LOOK_STRUCTURES)[0]
      const weight = structure && !structure.walkable ? structure.hits + 1 : 1

      costs.set(position.x, position.y, weight)
    })

    return costs
  }
}
