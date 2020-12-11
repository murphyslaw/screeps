'use strict';

Object.defineProperties(StructureController.prototype, {
  'memory': {
    get: function () {
      return this.room.memory.controller = this.room.memory.controller || {};
    },
    configurable: true
  },

  'container': {
    get: function () {
      if (!this._container) {
        if (!this.memory.container) {
          const container = this.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
              return structure.structureType == STRUCTURE_CONTAINER;
            }
          });

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
