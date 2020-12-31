'use strict'

Object.defineProperties(Source.prototype, {
  // number of WORK parts needed to drain the energy source before regeneration
  'neededWorkparts': {
    get: function () {
      const ticksToRegeneration = (this.ticksToRegeneration || ENERGY_REGEN_TIME)
      const neededWorkparts = Math.ceil(this.energy / ticksToRegeneration / HARVEST_POWER)

      return neededWorkparts
    },
    configurable: true
  },

  'freeSpaceCount': {
    get: function() {
      if (!this._freeSpaceCount) {
        if (!this.memory.freeSpaceCount) {
          const freePositions = _.filter(this.pos.adjacentPositions, function (position) {
            const terrain = this.room.getTerrain()

            return terrain.get(position.x, position.y) != TERRAIN_MASK_WALL
          }, this)

          this.memory.freeSpaceCount = freePositions.length
        }

        this._freeSpaceCount = this.memory.freeSpaceCount
      }

      return this._freeSpaceCount
    },
    configurable: true
  },

  'memory': {
    get: function () {
      return this.room.memory.sources[this.id] = this.room.memory.sources[this.id] || {}
    },
    configurable: true
  },

  'container': {
    get: function () {
      if (!this._container) {
        if (!this.memory.container) {
          const container = _.find(this.room.containers, container => this.pos.isNearTo(container))

          if (container) {
            this.memory.container = container.id
          }
        }

        const container = Game.getObjectById(this.memory.container)

        if (container) {
          this._container = container
        } else {
          delete this.memory.container
        }
      }

      return this._container
    },
    configurable: true
  }
})
