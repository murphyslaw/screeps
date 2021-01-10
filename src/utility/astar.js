'use strict'

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

global.AStar = AStar
