'use strict'

global.Monument = class {
  constructor(roomName) {
    this.room = Game.rooms[roomName]
  }

  get visualizer() {
    if (!this._visualizer) {
      const scoreCollector = this.scoreCollector

      if (!scoreCollector) return

      this._visualizer = new MonumentVisualizer(this.scoreCollector.pos)
    }

    return this._visualizer
  }

  get scoreCollector() {
    if (!this.room) return

    if (!this._scoreCollector) {
      this._scoreCollector = this.room.scoreCollector
    }

    return this._scoreCollector
  }
}
