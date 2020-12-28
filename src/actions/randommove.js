'use strict'

class RandomMove extends Action {
  constructor(actor) {
    super()

    this.actor = actor
  }

  update() {
    const directions = [
      TOP,
      TOP_RIGHT,
      RIGHT,
      BOTTOM_RIGHT,
      BOTTOM,
      BOTTOM_LEFT,
      LEFT,
      TOP_LEFT,
    ]

    return this.actor.move(_.sample(directions))
  }
}

global.RandomMove = RandomMove
