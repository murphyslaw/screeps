'use strict'

const prototype = Room.prototype

prototype.logger = new global.Logger('room')
prototype.debug = function (...messages) {
  this.logger.debug('"' + this.name + '"', '-', ...messages)
}

prototype.update = function() {
  const nonSpawningSpawns = this.nonSpawningSpawns

  _.forEach(nonSpawningSpawns, function(spawn) {
    _.some(config.roles, function(roleName) {
      const role = new global[roleName]()

      if (this.wantsToSpawn(role)) {
        this.spawn(spawn, role)
        return true
      }

      return false
    }, this)
  }, this)
}

prototype.creeps = function(roleName) {
  let conditions = [
    creep => creep.home.name === this.name
  ]

  if (roleName) {
    conditions.push(creep => creep.role.name === roleName)
  }

  return _.filter(Game.creeps, creep => _.every(conditions, cond => cond.call(this, creep)))
}

prototype.findWithPriorities = function(type, priorities, filter) {
  let structures = this.find(type)
  structures = _.filter(structures, function(structure) {
    return priorities.includes(structure.structureType) &&
    filter ? filter.call(this, structure) : true
  }, this)

  const groups = _.groupBy(structures, 'structureType')
  const targets = _.reduce(priorities, function(total, type) {
    if (groups[type]) total.push(groups[type].shift())

    return total
  }, [])

  return targets
}

prototype.prioritize = function(rooms) {
  const index = rooms.indexOf(this)

  if (index > 0) {
    rooms.splice(index, 1)
    rooms.unshift(this)
  }

  return rooms
}

prototype.population = function(roleName) {
  switch(roleName) {
    case 'Builder': {
      const rooms = this.territory
      const number = _.filter(rooms, 'needsBuilder').length * 2

      return number
    }

    case 'Charger': {
      if (!this.storage) return 0

      return 1
    }

    case 'Claimer': {
      const rooms = World.knownRooms
      const needsClaimer = _.some(rooms, 'needsClaimer')

      if (needsClaimer && this.capital) return 1

      return 0
    }

    case 'ContainerExtractor': {
      const rooms = this.territory
      const number = _.sum(rooms, function (room) {
        const mineral = room.mineral

        if (!mineral) return 0
        if (mineral.ticksToRegeneration) return 0
        if (!mineral.container) return 0

        return 0
      })

      return number
    }

    case 'ContainerHarvester': {
      const rooms = this.territory
      let number = _.sum(rooms, room => room.sourceContainers.length)

      // FIXME: hardcoded lower number, because of overlapping territories
      if ('E19N34' === this.name) number -= 1

      return number
    }

    case 'Defender': {
      const rooms = this.territory
      const underAttack = _.some(rooms, 'underAttack')

      return underAttack ? 1 : 0
    }

    case 'Dismantler': {
      return 0
    }

    case 'Harvester': {
      if (3 > this.level) {
        const slots = _.sum(this.sources, function (source) {
          return Math.floor(source.freeSpaceCount)
        })

        return slots
      }

      const slots = _.sum(this.sources, function (source) {
        return source.container ? 0 : Math.floor(source.freeSpaceCount)
      })

      return slots
    }

    case 'Hauler': {
      let number = 0

      const sourceContainers = this.sourceContainers
      const numberSourceContainers = sourceContainers.length

      if (numberSourceContainers) {
        number += Math.floor(_.sum(sourceContainers, container => container.store.getUsedCapacity(RESOURCE_ENERGY)) / numberSourceContainers / 500)
      }

      number += this.extractor ? 1 : 0

      return number
    }

    case 'RemoteHarvester': {
      if (4 > this.level) return 0

      const rooms = this.remotes
      let number = 0

      number += _.sum(rooms, function (room) {
        return _.filter(room.sources, source => !source.container).length
      })

      return number
    }

    case 'RemoteHauler': {
      if (4 > this.level) return 0

      let rooms = this.remotes
      let number = 0

      number += _.sum(rooms, room => room.sourceContainers.length)
      number += _.sum(rooms, room => room.mineralContainer ? 1 : 0)

      return number
    }

    case 'Repairer': {
      const rooms = this.territory
      const number = _.filter(rooms, 'needsRepairer').length

      return number
    }

    case 'Reserver': {
      const rooms = this.territory
      const needsReserver = _.some(rooms, 'needsReserver')

      return needsReserver ? 1 : 0
    }

    case 'ScoreHarvester': {
      if (this.capital) {
        const needsScoreHarvester = _.some(World.knownRooms, 'needsScoreHarvester')

        return needsScoreHarvester ? 4 : 0
      }
    }

    case 'Scorer': {
      if (this.capital) {
        const storage = this.storage
        const number = storage && storage.store[RESOURCE_SCORE] > 1000 ? 1 : 0

        return number
      }
    }

    case 'Scout': {
      if (this.capital) {
        return 1
      }
    }

    case 'Signer': {
      const rooms = this.territory
      const needsSigner = _.some(rooms, 'needsSigner')

      return needsSigner ? 1 : 0
    }

    case 'Supplier': {
      const number = this.creeps('ContainerExtractor').length > 0 ? 0 : 0

      return number
    }

    case 'Upgrader': {
      const controllerContainer = this.controller.container
      const controllerContainerUsedCapacity = controllerContainer ? controllerContainer.store.getUsedCapacity(RESOURCE_ENERGY) : 0

      const number = Math.max(Math.floor(controllerContainerUsedCapacity / 2000), 1)

      return number
    }
  }

  return 0
}

prototype.wantsToSpawn = function(role) {
  const roleName = role.name
  const creeps = this.creeps(roleName)

  const count = creeps.length
  const number = this.population(roleName)

  if (count > number) return false

  const maxSpawnTime = role.maxSpawnTime

  const renew = _.some(creeps, function (creep) {
    return creep.ticksToLive <= maxSpawnTime
  }, this)

  return (count < number) || (count == number && renew)
}

prototype.spawn = function (spawn, role) {
  const roleName = role.name
  const bodyparts = role.bodyparts(this.energyAvailable)
  const options = { memory: { role: roleName, home: this.name } }

  let actionResult

  actionResult = new SpawnCreep(spawn, bodyparts, options).execute()

  if (OK === actionResult) {
    this.logger.debug('spawning', roleName, 'at', spawn.pos)
  }

  return actionResult
}

Object.defineProperties(prototype, {
  'visible': {
    get: function () {
      return true
    },
    configurable: true
  },

  'center': {
    get: function () {
      return new RoomPosition(25, 25, this.name)
    },
    configurable: true
  },

  'capital': {
    get: function () {
      return 'E19N32' === this.name
    },
    configurable: true
  },

  'my': {
    get: function () {
      return this.controller && this.controller.my ? true : false
    },
    configurable: true
  },

  'isHighway': {
    get: function () {
      const parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(this.name)
      const isHighway = (parsed[1] % 10 === 0) || (parsed[2] % 10 === 0)

      return isHighway
    },
    configurable: true
  },

  'isHighwayCrossing': {
    get: function () {
      const parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(this.name)
      const isHighwayCrossing = (parsed[1] % 10 === 0) && (parsed[2] % 10 === 0)

      return isHighwayCrossing
    },
    configurable: true
  },

  'neighbors': {
    get: function () {
      const neighborRoomNames = _.values(Game.map.describeExits(this.name))
      const neighbors = _.map(neighborRoomNames, roomName => World.getRoom(roomName))

      return neighbors
    },
    configurable: true
  },

  'remotes': {
    get: function() {
      return _.filter(this.neighbors, function (room) {
        const isRemote = true &&
          this.name != room.name &&
          !room.isHighway &&
          !World.myRooms.includes(room) &&
          !global.avoid.includes(room.name)

        return isRemote
      }, this)
    },
    configurable: true
  },

  'territory': {
    get: function() {
      return _.union([this], this.remotes)
    },
    configurable: true
  },

  'needsBuilder': {
    get: function () {
      return this.memory.needsBuilder ? true : false
    },
    set: function (value) {
      return this.memory.needsBuilder = value ? Game.time : 0
    },
    configurable: true
  },

  'needsSigner': {
    get: function () {
      const controller = this.controller

      if (!controller) return false
      if (!controller.my && !controller.reserved) return false

      const sign = controller.sign
      const needsSigner = !sign || sign.text !== Signing.text

      return needsSigner
    },
    configurable: true
  },

  'needsRepairer': {
    get: function () {
      return this.memory.needsRepairer ? true : false
    },
    set: function (value) {
      return this.memory.needsRepairer = value ? Game.time : 0
    },
    configurable: true
  },

  'needsScoreHarvester': {
    get: function () {
      return this.memory.needsScoreHarvester ? true : false
    },
    set: function (value) {
      return this.memory.needsScoreHarvester = value ? Game.time : 0
    },
    configurable: true
  },

  'needsClaimer': {
    get: function () {
      return this.claimFlag ? true : false
    },
    configurable: true
  },

  'needsReserver': {
    get: function () {
      const controller = this.controller

      if (!controller) return false

      let needsReserver
      const reservation = controller.reservation

      needsReserver = controller.reserved && reservation.ticksToEnd < 1000
      needsReserver = needsReserver || (!reservation && this.reserveFlag)

      return needsReserver
    },
    configurable: true
  },

  'flags': {
    get: function() {
      return _.filter(Game.flags, flag => this.name === flag.pos.roomName)
    },
    configurable: true
  },

  'claimFlag': {
    get: function() {
      const flag = Game.flags.claim

      return (flag && this.name === flag.pos.roomName) ? flag : null
    },
    configurable: true
  },

  'reserveFlag': {
    get: function() {
      const flag = Game.flags.reserve

      return (flag && this.name === flag.pos.roomName) ? flag : null
    },
    configurable: true
  },

  'underAttack': {
    get: function () {
      return this.memory.underAttack ? true : false
    },
    set: function (value) {
      return this.memory.underAttack = value ? Game.time : 0
    },
    configurable: true
  },

  'damagedStructures': {
    get: function() {
      if (!this._damagedStructures) {
        const structures = this.find(FIND_STRUCTURES, {
          filter: function(structure) {
            return structure.damaged &&
              structure.structureType != STRUCTURE_RAMPART &&
              structure.structureType != STRUCTURE_WALL &&
              structure.structureType != STRUCTURE_TOWER &&
              structure.hits / structure.hitsMax < 0.9
          }
        })

        this._damagedStructures = structures
      }

      return this._damagedStructures
    },
    configurable: true
  },

  'damagedDefenses': {
    get: function() {
      if (!this._damagedDefenses) {
        const structures = this.find(FIND_STRUCTURES, {
          filter: function(structure) {
            return structure.damaged &&
              (structure.structureType == STRUCTURE_RAMPART ||
              structure.structureType == STRUCTURE_WALL ||
              structure.structureType == STRUCTURE_TOWER)
          }
        })

        this._damagedDefenses = structures
      }

      return this._damagedDefenses
    },
    configurable: true
  },

  'defenses': {
    get: function() {
      if (!this._defenses) {
        const structures = this.find(FIND_STRUCTURES, {
          filter: function(structure) {
            return structure.structureType == STRUCTURE_RAMPART ||
              structure.structureType == STRUCTURE_WALL ||
              structure.structureType == STRUCTURE_TOWER
          }
        })

        this._defenses = structures
      }

      return this._defenses
    },
    configurable: true
  },

  'containers': {
    get: function() {
      if (!this._containers) {
        const containers = this.find(FIND_STRUCTURES, {
          filter: { structureType: STRUCTURE_CONTAINER }
        })

        this._containers = containers
      }

      return this._containers
    },
    configurable: true
  },

  'sourceContainers': {
    get: function () {
      if (!this._sourceContainers) {
        const sourceContainers = _.reduce(this.sources, function(containers, source) {
          const container = source.container

          if (container) {
            containers.push(container)
          }

          return containers
        }, [])

        this._sourceContainers = sourceContainers
      }

      return this._sourceContainers
    },
    configurable: true
  },

  'sourceContainerCount': {
    get: function () {
      return this.sourceContainers.length
    },
    configurable: true
  },

  'controllerContainer': {
    get: function () {
      if (!this._controllerContainer) {
        const controllerContainer = _.find(this.containers, container => container === this.controller.container)

        this._controllerContainer = controllerContainer
      }

      return this._controllerContainer
    },
    configurable: true
  },

  'scoreContainers': {
    get: function () {
      if (!this._scoreContainers) {
        const scoreContainers = this.find(FIND_SCORE_CONTAINERS)

        this._scoreContainers = scoreContainers
      }

      return this._scoreContainers
    },
    configurable: true
  },

  'constructionSites': {
    get: function() {
      if (!this._constructionSites) {
        const constructionSites = this.find(FIND_MY_CONSTRUCTION_SITES)

        this._constructionSites = constructionSites
      }

      return this._constructionSites
    },
    configurable: true
  },

  'spawns': {
    get: function() {
      if (!this._spawns) {
        this._spawns = _.filter(Game.spawns, spawn => this.name === spawn.room.name)
      }

      return this._spawns
    },
    configurable: true
  },

  'extensions': {
    get: function() {
      if (!this._extensions) {
        this._extensions = this.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_EXTENSION } })
      }

      return this._extensions
    },
    configurable: true
  },

  'towers': {
    get: function() {
      if (!this._towers) {
        this._towers = this.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } })
      }

      return this._towers
    },
    configurable: true
  },

  'nonSpawningSpawns': {
    get: function() {
      if (!this._nonSpawningSpawns) {
        const spawns = _.reject(this.spawns, 'spawning')

        this._nonSpawningSpawns = spawns
      }

      return this._nonSpawningSpawns
    },
    configurable: true
  },

  'sources': {
    get: function () {
      if (!this._sources) {
        if (!this.memory.sources) {
          this.memory.sources = {}

          this.find(FIND_SOURCES).map(source => this.memory.sources[source.id] = {})
        }

        this._sources = _.keys(this.memory.sources).map(id => Game.getObjectById(id))
      }

      return this._sources
    },
    configurable: true
  },

  'sourceCount': {
    get: function () {
      return _.keys(this.memory.sources).length
    },
    configurable: true
  },

  'minerals': {
    get: function() {
      delete this.memory.minerals
      return []
    },
    configurable: true
  },

  'extractors': {
    get: function() {
      delete this.memory.extractors
      return []
    },
    configurable: true
  },

  'mineral': {
    get: function () {
      if (!this._mineral) {
        const memory = this.memory

        if (!memory.mineral) {
          memory.mineral = {}

          const mineral = this.find(FIND_MINERALS)[0]

          if (mineral) {
            memory.mineral.id = mineral.id
          }
        }

        this._mineral = Game.getObjectById(memory.mineral.id)
      }

      return this._mineral
    },
    configurable: true
  },

  'extractor': {
    get: function () {
      const mineral = this.mineral

      return mineral.extractor
    },
    configurable: true
  },

  'mineralContainer': {
    get: function () {
      const mineral = this.mineral

      return mineral.container
    },
    configurable: true
  },

  'scoreCollector': {
    get: function () {
      if (!this.isHighwayCrossing) return null

      if (!this._scoreCollector) {
        if (!this.memory.scoreCollector) {
          const scoreCollector = this.find(FIND_SCORE_COLLECTORS)[0]

          if (scoreCollector) {
            this.memory.scoreCollector = { id: scoreCollector.id }
          }
        }

        this._scoreCollector = Game.getObjectById(this.memory.scoreCollector.id)
      }

      return this._scoreCollector
    },
    configurable: true
  },

  'hostiles': {
    get: function() {
      if (!this._hostiles) {
        const hostiles = this.find(FIND_HOSTILE_CREEPS, { filter: function (creep) {
          return creep.getActiveBodyparts(ATTACK) > 0 ||
            creep.getActiveBodyparts(RANGED_ATTACK) > 0
          }
        })

        this._hostiles = hostiles
      }

      return this._hostiles
    },
    configurable: true
  },

  'isTerritory': {
    get: function () {
      return World.territory.includes(this.name)
    },
    configurable: true
  },

  'level': {
    get: function () {
      const controller = this.controller

      return controller && controller.level
    },
    configurable: true
  }
})
