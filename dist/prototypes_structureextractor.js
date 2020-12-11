'use strict';

Object.defineProperties(StructureExtractor.prototype, {
  'memory': {
    get: function () {
      return this.room.memory.extractors[this.id] = this.room.memory.extractors[this.id] || {};
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

        const container = Game.getObjectById(this.memory.container);

        if (container) {
          this._container = container;
        } else {
          delete this.memory.container;
        }
      }

      return this._container;
    },
    configurable: true
  },

  'mineral': {
    get: function () {
      if (!this._mineral) {
        if (!this.memory.mineral) {
          const mineral = this.lookFor(LOOK_MINERALS)[0];

          if (mineral) {
            this.memory.mineral = mineral.id;
          }
        }

        const mineral = Game.getObjectById(this.memory.mineral);

        if (mineral) {
          this._mineral = mineral;
        } else {
          delete this.memory.mineral;
        }
      }

      return this._mineral;
    },
    configurable: true
  }
});
