'use strict'

const prototype = ScoreCollector.prototype

prototype.visualize = function() {
  new MonumentVisualizer(this).run()
}

Object.defineProperties(prototype, {
  'memory': {
    get: function () {
      return this.room.memory.scoreCollector = this.room.memory.scoreCollector || {}
    },
    configurable: true
  },

  'optimalPath': {
    get: function () {
      return Room.deserializePath(this.memory.path)
    },
    set: function(value) {
      this.memory.path = value
    },
    configurable: true
  },

  'walls': {
    get: function () {
      return this.pos.neighbors(WALLS_RADIUS)
    },
    configurable: true
  },

  'blocker': {
    get: function() {
      const roomName = this.room.name
      const path = MonumentPathFinder.find(this)

      const targets = _.reduce(path, function (targets, step) {
        const position = new RoomPosition(step.x, step.y, roomName)
        const structure = position.lookFor(LOOK_STRUCTURES)[0]

        if (structure && !structure.walkable) {
          targets.push(structure)
        }

        return targets
      }, [], this)

      const target = targets[0]

      return target
    },
    configurable: true
  },
})
