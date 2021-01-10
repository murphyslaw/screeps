'use strict'

Object.defineProperties(Mineral.prototype, {
  'memory': {
    get: function () {
      const roomMemory = this.room.memory

      roomMemory.mineral = roomMemory.mineral || {}

      return roomMemory.mineral
    },
    configurable: true
  },

  'extractor': {
    get: function () {
      if (!this._extractor) {
        const memory = this.memory

        if (!memory.extractor) {
          const position = this.pos
          const extractor = position.lookFor(LOOK_STRUCTURES)[0]

          if (extractor) {
            memory.extractor = extractor.id
          }
        }

        const extractor = Game.getObjectById(memory.extractor)

        if (extractor) {
          this._extractor = extractor
        } else {
          delete memory.extractor
        }
      }

      return this._extractor
    },
    configurable: true
  },

  'container': {
    get: function () {
      if (!this._container) {
        const memory = this.memory

        if (!memory.container) {
          const containers = this.room.containers
          const position = this.pos
          const container = _.find(containers, container => position.isNearTo(container))

          if (container) {
            memory.container = container.id
          }
        }

        const container = Game.getObjectById(memory.container)

        if (container) {
          this._container = container
        } else {
          delete memory.container
        }
      }

      return this._container
    },
    configurable: true
  }
})
