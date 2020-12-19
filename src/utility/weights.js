'use strict'

global.Weights = class {
  constructor() {
    this.cols = 11
    this.rows = 11
    this.offset = {
      x: 8,
      y: 12
    }
  }
  // get weights() {
  //   return [...Array(this.cols * this.rows)].map(e => ~~(Math.random() * 100 / 1))
  // },

  get weights() {
    return [
      10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
      10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
      10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
      10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
      10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
      10, 10, 10, 10, 10, 100, 10, 10, 10, 10, 1,
      10, 10, 10, 10, 10, 5, 2.5, 10, 10, 10, 10,
      10, 10, 10, 10, 10, 5, 10, 25, 10, 10, 10,
      10, 10, 10, 10, 10, 5, 10, 10, 25, 10, 10,
      10, 10, 10, 10, 10, 5, 10, 10, 10, 10, 10,
      10, 10, 10, 10, 10, 5, 10, 10, 10, 10, 25,
    ]
  }

  getWeight = function (position) {
    const x = position.x - this.offset.x
    const y = position.y - this.offset.y

    const weight = this.weights[y * this.cols + x] || Infinity

    return weight
  }
}
