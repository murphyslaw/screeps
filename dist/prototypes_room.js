'use strict';

Room.prototype.updateState = function() {
  this.needsBuilder = this.constructionSites.length > 0;
  this.needsRepairer = this.damagedStructures.length > 0;
  this.needsScoreHarvester = this.scoreContainers.length > 0;

  return;
}

Object.defineProperties(Room.prototype, {
  'needsBuilder': {
    get: function () {
      return this.memory.needsBuilder;
    },
    set: function (value) {
      if (value) {
        this.memory.needsBuilder = value;
      } else if (this.memory.needsBuilder) {
        delete this.memory.needsBuilder;
      }

      return;
    },
    configurable: true
  },

  'needsRepairer': {
    get: function () {
      return this.memory.needsRepairer;
    },
    set: function (value) {
      if (value) {
        this.memory.needsRepairer = value;
      } else if (this.memory.needsRepairer) {
        delete this.memory.needsRepairer;
      }

      return;
    },
    configurable: true
  },

  'needsScoreHarvester': {
    get: function () {
      return this.memory.needsScoreHarvester;
    },
    set: function (value) {
      if (value) {
        this.memory.needsScoreHarvester = value;
      } else if (this.memory.needsScoreHarvester) {
        delete this.memory.needsScoreHarvester;
      }

      return;
    },
    configurable: true
  },

  'damagedStructures': {
    get: function() {
      const structures = this.find(FIND_STRUCTURES, {
        filter: function(structure) {
          return structure.damaged &&
            structure.structureType != STRUCTURE_RAMPART &&
            structure.structureType != STRUCTURE_WALL &&
            structure.structureType != STRUCTURE_TOWER;
        }
      });

      return structures;
    },
    configurable: true
  },

  'damagedDefenses': {
    get: function() {
      const structures = this.find(FIND_STRUCTURES, {
        filter: function(structure) {
          return structure.damaged &&
            (structure.structureType == STRUCTURE_RAMPART ||
            structure.structureType == STRUCTURE_WALL ||
            structure.structureType == STRUCTURE_TOWER)
        }
      });

      return structures;
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
      const sourceContainers = _.reduce(this.sources, function(containers, source) {
        const container = source.container;

        if (container) {
          containers.push(container);
        }

        return containers;
      }, []);

      return sourceContainers;
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
      return this.find(FIND_MY_CONSTRUCTION_SITES);
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
  },

  'extractors': {
    get: function () {
      if (!this._extractors) {
        if (!this.memory.extractors) {
          this.memory.extractors = {}

          const extractors = this.find(FIND_MY_STRUCTURES, {
            filter: (structure) => {
              return structure.structureType == STRUCTURE_EXTRACTOR;
            }
          });

          extractors.map(extractor => this.memory.extractors[extractor.id] = {})
        }

        this._extractors = _.reduce(_.keys(this.memory.extractors), function (extractors, id) {
          const extractor = Game.getObjectById(id);

          if (extractor) {
            extractors.push(extractor);
          } else {
            delete this.memory.extractors[id];
          }

          return extractors;
        }, []);
      }

      return this._extractors;
    },
    configurable: true
  },

  'minerals': {
    get: function () {
      if (!this._minerals) {
        if (!this.memory.minerals) {
          this.memory.minerals = {}

          const minerals = this.find(FIND_MINERALS);

          minerals.map(mineral => this.memory.minerals[mineral.id] = {})
        }

        this._minerals = _.keys(this.memory.minerals).map(id => Game.getObjectById(id));
      }

      return this._minerals;
    },
    configurable: true
  },

  'mineralContainers': {
    get: function () {
      const mineralContainers = _.reduce(this.minerals, function (containers, mineral) {
        const container = mineral.container;

        if (container) {
          containers.push(container);
        }

        return containers;
      }, []);

      return mineralContainers;
    },
    configurable: true
  }
});
