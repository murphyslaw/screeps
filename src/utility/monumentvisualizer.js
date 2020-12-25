'use strict'

class MonumentVisualizer {
  constructor(scoreCollector) {
    this.scoreCollector = scoreCollector
    this.visual = scoreCollector.room.visual
  }

  run() {
    const weights = this.positions.map(this.getWeight)
    const max = Math.max(...weights)
    const optimalPath = this.scoreCollector.optimalPath

    this.positions.forEach(function (position) {
      const value = this.getWeight(position, position)

      if (value <= 0) return

      const x = position.x
      const y = position.y
      const percent = Math.floor((value / max) * 100)

      const topLeftX = x - .5
      const offset = 1 - (percent / 100)
      const topLeftY = y - .5
      const height = 1 - offset

      let backgroundColor = '#333333'

      if (optimalPath && _.some(optimalPath, position => position.x === x && position.y === y)) {
        backgroundColor = '#ffa500'
      }

      this.visual.rect(topLeftX, topLeftY, 1, 1, {
        fill: backgroundColor, radius: .5, opacity: 1, stroke: '#000000', strokeWidth: .03
      })

      this.visual.rect(topLeftX, topLeftY + offset, 1, height, {
        fill: this.getGradient(percent / 100), radius: .5, opacity: 1
      })

      this.visual.text(percent + '%', x, y + .1, {
        color: '#ffffff', font: .35
      })

      return
    }, this)

    return
  }

  get positions() {
    if (!this.scoreCollector) return

    if (!this._positions) {
      const scoreCollector = this.scoreCollector
      this._positions = scoreCollector ? scoreCollector.pos.neighbors(5) : []
    }

    return this._positions
  }

  getWeight(position) {
    const structure = position.lookFor(LOOK_STRUCTURES)[0]

    if (structure && !structure.walkable) {
      return Math.floor(structure.hits / structure.hitsMax * 100)
    }

    return 0
  }

  getGradient(percentFade) {
    const startColor = this.hexToRgb('#00ff00')
    const endColor = this.hexToRgb('#cc0000')

    var diffRed = endColor.red - startColor.red
    var diffGreen = endColor.green - startColor.green
    var diffBlue = endColor.blue - startColor.blue

    diffRed = Math.round((diffRed * percentFade) + startColor.red)
    diffGreen = Math.round((diffGreen * percentFade) + startColor.green)
    diffBlue = Math.round((diffBlue * percentFade) + startColor.blue)

    return this.rgbToHex(diffRed, diffGreen, diffBlue)
  }

  hexToRgb(hex) {
    let match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

    if (match) {
      return {
        red: parseInt(match[1], 16),
        green: parseInt(match[2], 16),
        blue: parseInt(match[3], 16),
      }
    }

    return
  }

  rgbToHex(red, green, blue) {
    return '#' + this.componentToHex(red) + this.componentToHex(green) + this.componentToHex(blue)
  }

  componentToHex(component) {
    const hex = component.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
}

global.MonumentVisualizer = MonumentVisualizer
