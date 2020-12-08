'use strict';

Room.prototype.damagedStructures = function() {
  const targets = this.find(FIND_STRUCTURES, {
    filter: structure => structure.hits < structure.hitsMax
  });

  return targets.sort((a, b) => a.hits - b.hits);
};

Room.prototype.neededHarvester = function() {
  const sources = this.find(FIND_SOURCES);

  const sum = _.sum(sources, function(source) {
    return source.neededWorkPartsCount();
  });

  return sum;
}

Object.defineProperties(Room.prototype, {
  'damagedStructures': {
    get: function() {
      const structures = this.find(FIND_STRUCTURES, {
        filter: structure => structure.hits < structure.hitsMax
      });

      return structures.sort((a, b) => a.hits - b.hits);
    },
    configurable: true
  },

  'containers': {
    get: function() {
      return this.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return structure.structureType == STRUCTURE_CONTAINER;
        }
      });
    },
    configurable: true
  },

  'sourceContainers': {
    get: function () {
      return this.sources.map(source => source.container);
    },
    configurable: true
  },

  'scoreContainers': {
    get: function () {
      return this.find(FIND_SCORE_CONTAINERS);
    },
    configurable: true
  },

  'constructionSites': {
    get: function() {
      return this.find(FIND_CONSTRUCTION_SITES);
    },
    configurable: true
  },

  'spawns': {
    get: function() {
      if (!this._spawns) {
        this._spawns = this.find(FIND_MY_SPAWNS);
      }

      return this._spawns;
    },
    configurable: true
  },

  'nonSpawningSpawns': {
    get: function() {
      return this.find(FIND_MY_SPAWNS, { filter: spawn => !spawn.spawning });
    },
    configurable: true
  },

  'sources': {
    get: function () {
      if (!this._sources) {
        if (!this.memory.sources) {
          this.memory.sources = {}

          this.find(FIND_SOURCES).map(source => this.memory.sources[source.id] = {});
        }

        this._sources = _.keys(this.memory.sources).map(id => Game.getObjectById(id));
      }

      return this._sources;
    },
    configurable: true
  }
});
