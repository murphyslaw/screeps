'use strict'

global.Move = class extends Action {
  constructor(actor, destination, options) {
    super()

    this.actor = actor
    this.destination = destination
    this.options = options
  }

  update() {
    if (this.options.path) {
      const path = this.options.path

      this.actor.room.visual.poly(_.filter(path, 'roomName', this.actor.room.name), {
        lineStyle: 'dotted',
        stroke: '#ff0000',
        opacity: 1
      })

      return this.actor.moveByPath(path)
    }

    return this.actor.moveTo(this.destination, this.options)
  }
}
