'use strict'

global.Logger = class {
  constructor(scope) {
    this._scope = scope
  }

  get scope() {
    return this._scope
  }

  get config() {
    return _.get(global, 'config.debug', {})
  }

  get active() {
    return _.get(global, 'config.debug.active', false)
  }

  get activeScope() {
    return _.get(this.config, 'scope.' + this._scope.toLowerCase(), false)
  }

  debug() {
    if (!this.active) { return }
    if (!this.activeScope) { return }

    const prefix = 'DEBUG:' + this.scope.toUpperCase()

    this.log(prefix, ...arguments)
  }

  log() {
    console.log(Game.time, ...arguments)
  }
}
