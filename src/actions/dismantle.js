'use strict'

global.Dismantle = class extends global.Action {
  constructor(actor, target) {
    super()

    this.actor = actor
    this.target = target
  }

  update() {
    // new RoomVisual('W20N30').circle(this.target.pos, {
    //   fill: '#0000ff',
    //   opacity: 1,
    // })

    return this.actor.dismantle(this.target)
  }
}
