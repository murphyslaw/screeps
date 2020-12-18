'use strict'

require('version')

if (!Memory.SCRIPT_VERSION || Memory.SCRIPT_VERSION != SCRIPT_VERSION) {
  Memory.SCRIPT_VERSION = SCRIPT_VERSION
  console.log('New code uploaded', SCRIPT_VERSION)
}

RoomPosition.prototype.neighbors = function(range = 1) {
  const positions = []
  let x
  let y

  for (let xRange = range; xRange >= -range; xRange--) {
    x = clamp(this.x + xRange, 1, 49)

    for (let yRange = range; yRange >= -range; yRange--) {
      y = clamp(this.y + yRange, 1, 49)

      if (!(x === this.x && y === this.y)) {
        positions.push(new RoomPosition(x, y, this.roomName))
      }
    }
  }

  return positions
}

Object.defineProperties(Structure.prototype, {
  'walkable': {
    get: function() {
      switch(this.structureType) {
        case STRUCTURE_CONTAINER:
        case STRUCTURE_RAMPART:
          return true
        default:
          return false
      }
    },
    configurable: true
  }
})

Object.defineProperties(Room.prototype, {
  'scoreCollector': {
    get: function () {
      const options = {
        // TODO: change to STRUCTURE_SCORE_COLLECTOR
        filter: { structureType: STRUCTURE_CONTAINER }
      }

      return this.find(FIND_STRUCTURES, options)[0]
    },
    configurable: true
  }
})

function clamp(number, lower, upper) {
  number = number <= upper ? number : upper
  number = number >= lower ? number : lower

  return number
}

class Weights {
  constructor() {
    this.cols = 11
    this.rows = 11
    this.offset = {
      x: 8,
      y: 12
    }
  }
  // get weights() {
  //   return [...Array(this.cols * this.rows)].map(e => ~~(Math.random() * 100 / 1))
  // },

  get weights() {
    return [
      10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
      10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
      10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
      10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
      10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
      10, 10, 10, 10, 10, 100, 10, 10, 10, 10, 1,
      10, 10, 10, 10, 10, 5, 2.5, 10, 10, 10, 10,
      10, 10, 10, 10, 10, 5, 10, 25, 10, 10, 10,
      10, 10, 10, 10, 10, 5, 10, 10, 25, 10, 10,
      10, 10, 10, 10, 10, 5, 10, 10, 10, 10, 10,
      10, 10, 10, 10, 10, 5, 10, 10, 10, 10, 25,
    ]
  }

  getWeight = function(position) {
    const x = position.x - this.offset.x
    const y = position.y - this.offset.y

    const weight = this.weights[y * this.cols + x] || Infinity

    return weight
  }
}

class Monument {
  constructor(roomName) {
    this.room = Game.rooms[roomName]
  }

  get visualizer() {
    if (!this._visualizer) {
      const scoreCollector = this.scoreCollector

      if (!scoreCollector) return

      this._visualizer = new MonumentVisualizer(this.scoreCollector.pos)
    }

    return this._visualizer
  }

  get scoreCollector() {
    if (!this.room) return

    if (!this._scoreCollector) {
      this._scoreCollector = this.room.scoreCollector
    }

    return this._scoreCollector
  }
}

class MonumentPathFinder {
  get options() {
    return {
      plainCost: 2,
      swampCost: 10,
      roomCallback: this.roomCallback,
    }
  }

  search = function(start, goal) {
    goal = { pos: goal, range: 1 }
    const result = PathFinder.search(start, goal, this.options)

    return result
  }

  roomCallback = function (roomName) {
    const room = Game.rooms[roomName]
    if (!room) return
    if (!room.scoreCollector) return

    const costs = new PathFinder.CostMatrix

    const positions = room.scoreCollector.pos.neighbors(5)
    positions.forEach(function (position) {
      const structure = position.lookFor(LOOK_STRUCTURES)[0]
      const weight = structure && !structure.walkable ? structure.hits + 1 : 1

      costs.set(position.x, position.y, weight)
    })

    return costs
  }
}

class AStar {
  search = function (start, goal) {
    if (!start) return
    if (!goal) return

    // The set of discovered nodes that may need to be (re-)expanded.
    // Initially, only the start node is known.
    const openSet = [start]

    // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from start
    // to n currently known.
    const cameFrom = new Map()

    // For node n, gScore[n] is the cost of the cheapest path from start to n currently known.
    const gScore = new Map()
    gScore.set(start, 0)

    // For node n, fScore[n] := gScore[n] + h(n). fScore[n] represents our current best guess as to
    // how short a path from start to finish can be if it goes through n.
    const fScore = new Map()
    fScore.set(start, this.h(start, goal))

    while (openSet.length != 0) {
      // current is the node in openSet having the lowest fScore[] value
      const current = _.min(openSet, function (node) {
        return (fScore.get(node) || Infinity)
      })

      if (current.isEqualTo(goal)) {
        const path = this.reconstructPath(cameFrom, current)

        return path
      }

      _.remove(openSet, position => position.isEqualTo(current))

      _.forEach(current.neighbors(1), function (neighbor) {
        // tentative_gScore is the distance from start to the neighbor through current
        const tentativeGScore = this.getMapValue(gScore, current) + this.d(current, neighbor)

        if (tentativeGScore < this.getMapValue(gScore, neighbor)) {
          // This path to neighbor is better than any previous one. Record it!
          cameFrom.set(neighbor, current)
          gScore.set(neighbor, tentativeGScore)
          fScore.set(neighbor, tentativeGScore + this.h(neighbor, goal))

          if (!_.some(openSet, node => node.isEqualTo(neighbor))) {
            openSet.push(neighbor)
          }
        }
      }, this)
    }

    // openSet is empty but goal was never reached
    return
  }

  // d(neighbor) is the weight of the neighbor.
  d = function (neighbor) {
    const structure = neighbor.lookFor(LOOK_STRUCTURES)[0]

    if (structure && !structure.walkable) {
      return structure.hits + 1
    }

    return 1
  }

  // h is the heuristic function. h(node, goal) estimates the cost to reach goal from node n.
  h = function (node, goal) {
    return node.getRangeTo(goal)
  }

  reconstructPath = function (cameFrom, current) {
    let totalPath = [current]

    while (cameFrom.get(current) !== undefined) {
      current = cameFrom.get(current)
      totalPath.unshift(current)
    }

    return totalPath
  }

  getMapValue = function (map, current) {
    let result = Infinity

    map.forEach(function (value, node) {
      if (node.isEqualTo(current)) {
        result = value
        return
      }
    })

    return result
  }
}

class MonumentVisualizer {
  constructor(room) {
    this.room = room
    this.visual = room.visual
  }

  get positions() {
    if (!this.room) return

    if (!this._positions) {
      const scoreCollector = this.room.scoreCollector
      this._positions = scoreCollector ? scoreCollector.pos.neighbors(5) : []
    }

    return this._positions
  }

  run = function() {
    const weights = this.positions.map(this.getWeight)
    const max = Math.max(...weights)

    this.positions.forEach(function (position) {
      const value = this.getWeight(position, position)

      if (value <= 0) return

      const x = position.x
      const y = position.y
      const percent = Math.floor((value / max) * 100)

      const topLeftX = x - .5
      const offset = 1 - (percent / 100)
      const topLeftY = y - .5
      const height = 1 - offset

      this.visual.rect(topLeftX, topLeftY, 1, 1, {
        fill: '#333333', radius: .5, opacity: 1, stroke: '#000000', strokeWidth: .03
      })

      this.visual.rect(topLeftX, topLeftY + offset, 1, height, {
        fill: this.getGradient(percent / 100), radius: .5, opacity: 1
      })

      this.visual.text(percent + '%', x, y + .1, {
        color: '#ffffff', font: .35
      })

      return
    }, this)

    return
  }

  getWeight = function (position) {
    const structure = position.lookFor(LOOK_STRUCTURES)[0]

    if (structure && !structure.walkable) {
      return structure.hits
    }

    return 0
  }

  getGradient = function (percentFade) {
    const startColor = this.hexToRgb('#00ff00')
    const endColor = this.hexToRgb('#ff0000')

    var diffRed = endColor.red - startColor.red
    var diffGreen = endColor.green - startColor.green
    var diffBlue = endColor.blue - startColor.blue

    diffRed = Math.round((diffRed * percentFade) + startColor.red)
    diffGreen = Math.round((diffGreen * percentFade) + startColor.green)
    diffBlue = Math.round((diffBlue * percentFade) + startColor.blue)

    return this.rgbToHex(diffRed, diffGreen, diffBlue)
  }

  hexToRgb = function (hex) {
    let match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

    if (match) {
      return {
        red: parseInt(match[1], 16),
        green: parseInt(match[2], 16),
        blue: parseInt(match[3], 16),
      }
    }

    return
  }

  rgbToHex = function (red, green, blue) {
    return '#' + this.componentToHex(red) + this.componentToHex(green) + this.componentToHex(blue)
  }

  componentToHex = function (component) {
    const hex = component.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
}

module.exports.loop = function() {
  try {
    const roomName = 'sim'

    const room = Game.rooms[roomName]
    const monumentVisualizer = new MonumentVisualizer(room)
    monumentVisualizer.run()

    const monumentPathFinder = new MonumentPathFinder()
    // TODO: use creep position
    const start = new RoomPosition(25, 25, roomName)
    const monument = new Monument(roomName)
    const goal = monument.scoreCollector ? monument.scoreCollector.pos : null
    const path = monumentPathFinder.search(start, goal) || []

    new RoomVisual(roomName).poly(path.path, {
      stroke: '#00ff00',
      strokeWidth: .1,
      opacity: .8,
      lineStyle: 'dashed',
    })
  } catch(error) {
    console.log(error.stack)
  }
}
