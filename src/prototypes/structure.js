'use strict';

Object.defineProperties(Structure.prototype, {
  'damaged': {
    get: function () {
      return this.hits < this.hitsMax;
    },
    configurable: true
  },

  'healthy': {
    get: function () {
      return this.hits == this.hitsMax;
    },
    configurable: true
  },

  'walkable': {
    get: function () {
      const structureType = this.structureType

      if (STRUCTURE_RAMPART === structureType && this.my) return true
      if (OBSTACLE_OBJECT_TYPES.includes(structureType)) return false

      return true
    },
    configurable: true
  }
});
