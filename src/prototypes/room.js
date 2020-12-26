'use strict'

const prototype = Room.prototype

prototype.logger = new global.Logger('room')
prototype.debug = function (...messages) {
  this.logger.debug('"' + this.name + '"', '-', ...messages)
}

prototype.creeps = function(role) {
  let conditions = [
    creep => creep.room.name === this.name
  ]

  if (role) {
    conditions.push(creep => creep.role === role)
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

Object.defineProperties(prototype, {
  'invisible': {
    get: function () {
      return false
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
      return _.values(Game.map.describeExits(this.name))
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
      return this.memory.needsSigner ? true : false
    },
    set: function (value) {
      return this.memory.needsSigner = value ? Game.time : 0
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

  'needsContainerHarvester': {
    get: function () {
      return this.memory.needsContainerHarvester ? true : false
    },
    set: function (value) {
      return this.memory.needsContainerHarvester = value ? Game.time : 0
    },
    configurable: true
  },

  'needsClaimer': {
    get: function () {
      return this.claimFlag ? true : false
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

  'nonSpawningSpawns': {
    get: function() {
      if (!this._nonSpawningSpawns) {
        const spawns = _.reject(Game.spawns, 'spawning')

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

  'extractors': {
    get: function () {
      if (!this._extractors) {
        if (!this.memory.extractors) {
          this.memory.extractors = {}

          const extractors = this.find(FIND_MY_STRUCTURES, {
            filter: (structure) => {
              return structure.structureType == STRUCTURE_EXTRACTOR
            }
          })

          extractors.map(extractor => this.memory.extractors[extractor.id] = {})
        }

        this._extractors = _.reduce(_.keys(this.memory.extractors), function (extractors, id) {
          const extractor = Game.getObjectById(id)

          if (extractor) {
            extractors.push(extractor)
          } else {
            delete this.memory.extractors[id]
          }

          return extractors
        }, [])
      }

      return this._extractors
    },
    configurable: true
  },

  'mineral': {
    get: function () {
      if (!this._minerals) {
        if (!this.memory.minerals) {
          this.memory.minerals = {}

          const minerals = this.find(FIND_MINERALS)

          minerals.map(mineral => this.memory.minerals[mineral.id] = {})
        }

        this._minerals = _.keys(this.memory.minerals).map(id => Game.getObjectById(id))
      }

      return this._minerals[0]
    },
    configurable: true
  },

  'mineralContainers': {
    get: function () {
      const mineralContainers = _.reduce(this.minerals, function (containers, mineral) {
        const container = mineral.container

        if (container) {
          containers.push(container)
        }

        return containers
      }, [])

      return mineralContainers
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
  }
})
