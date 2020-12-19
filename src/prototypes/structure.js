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
      return !OBSTACLE_OBJECT_TYPES.includes(this.structureType)
    },
    configurable: true
  }
});
