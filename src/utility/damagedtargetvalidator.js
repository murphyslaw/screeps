'use strict'

class DamagedTargetValidator {
  constructor(role) {
    this.role = role
  }

  filter(results) {
    return _.filter(results, this.isValid, this)
  }

  isValid(target) {
    if (!target) return false

    return target.hits < target.hitsMax
  }
}

global.DamagedTargetValidator = DamagedTargetValidator
