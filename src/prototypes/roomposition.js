'use strict'

RoomPosition.prototype.neighbors = function (range = 1) {
  const positions = []
  let x
  let y

  for (let xRange = range; xRange >= -range; xRange--) {
    x = _.clamp(this.x + xRange, 1, 49)

    for (let yRange = range; yRange >= -range; yRange--) {
      y = _.clamp(this.y + yRange, 1, 49)

      if (!(x === this.x && y === this.y)) {
        positions.push(new RoomPosition(x, y, this.roomName))
      }
    }
  }

  return positions
}

Object.defineProperties(RoomPosition.prototype, {
  'isBorderPosition': {
    get: function () {
      return _.some([this.x, this.y], pos => pos === 0 || pos === 49);
    },
    configurable: true
  },

  'adjacentPositions': {
    get: function() {
      return this.neighbors(1)
    },
    configurable: true
  },
});
