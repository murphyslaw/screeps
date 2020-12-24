'use strict'

global.Monument = class {
  constructor(room) {
    this.room = room
  }

  get scoreCollector() {
    if (!this.room) return

    if (!this._scoreCollector) {
      this._scoreCollector = this.room.scoreCollector
    }

    return this._scoreCollector
  }

  blocker(start) {
    if (!this.room) return

    const monumentPathFinder = new MonumentPathFinder()
    const goal = this.scoreCollector.pos
    const path = monumentPathFinder.find(start, goal)

    this.room.visual.poly(path, {
      stroke: '#ffc0cb',
      strokeWidth: 0.1,
      opacity: 1,
      lineStyle: 'dashed',
    })

    const targets = _.reduce(path, function(targets, step) {
      const position = new RoomPosition(step.x, step.y, this.room.name)
      const structure = position.lookFor(LOOK_STRUCTURES)[0]

      if (structure && !structure.walkable) {
        targets.push(structure)
      }

      return targets
    }, [], this)

    const target = targets[0]

    return target
  }
}
