'use strict';

Object.defineProperties(Mineral.prototype, {
  'memory': {
    get: function () {
      return this.room.memory.minerals[this.id] = this.room.memory.minerals[this.id] || {};
    },
    configurable: true
  },

  'extractor': {
    get: function () {
      if (!this._extractor) {
        if (!this.memory.extractor) {
          const extractor = this.pos.lookFor(LOOK_STRUCTURES)[0];

          if (extractor) {
            this.memory.extractor = extractor.id;
          }
        }

        const extractor = Game.getObjectById(this.memory.extractor);

        if (extractor) {
          this._extractor = extractor;
        } else {
          delete this.memory.extractor;
        }
      }

      return this._extractor;
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
  }
});
