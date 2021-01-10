'use strict'

Object.defineProperties(StructureExtractor.prototype, {
  'container': {
    get: function () {
      return this.mineral.container
    },
    configurable: true
  },

  'mineral': {
    get: function () {
      return this.room.mineral
    },
    configurable: true
  }
})
