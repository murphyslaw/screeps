'use strict';

Source.prototype.vacancies = function() {
  const creeps = _.filter(Game.creeps, function (creep) {
    return creep.getActiveBodyparts(WORK) > 0 &&
      creep.source == this
  }, this);

  if (creeps.length >= this.freeSpaceCount) {
    return false;
  }

  const neededWorkparts = this.energyCapacity / HARVEST_POWER / ENERGY_REGEN_TIME;
  const workpartsCount = _.sum(creeps, function (creep) {
    return creep.getActiveBodyparts(WORK);
  });

  if (workpartsCount >= neededWorkparts) {
    return false;
  }

  return true;
}

Object.defineProperties(Source.prototype, {
  // number of WORK parts needed to drain the energy source before regeneration
  'neededWorkparts': {
    get: function () {
      const ticksToRegeneration = (this.ticksToRegeneration || ENERGY_REGEN_TIME);
      const neededWorkparts = Math.ceil(this.energy / ticksToRegeneration / HARVEST_POWER);

      return neededWorkparts;
    },
    configurable: true
  },

  'freeSpaceCount': {
    get: function() {
      if (!this._freeSpaceCount) {
        if (!this.memory.freeSpaceCount) {
          const freePositions = _.filter(this.pos.adjacentPositions, function (position) {
            const terrain = this.room.getTerrain();

            return terrain.get(position.x, position.y) != TERRAIN_MASK_WALL;
          })

          this.memory.freeSpaceCount = freePositions.length;
        }

        this._freeSpaceCount = this.memory.freeSpaceCount;
      }

      return this._freeSpaceCount;
    },
    configurable: true
  },

  'memory': {
    get: function () {
      return this.room.memory.sources[this.id] = this.room.memory.sources[this.id] || {};
    },
    configurable: true
  },

  'container': {
    get: function () {
      if (!this._container) {
        if (!this.memory.container) {
          const container = _.find(this.room.containers, container => this.pos.isNearTo(container));

          if (container) {
            this.memory.container = container.id;
          }
        }

        this._container = Game.getObjectById(this.memory.container);
      }

      return this._container;
    },
    enumerable: false,
    configurable: true
  }
});
