'use strict'

global.ContainerExtractor = class extends EnergyRole {
  get name() { return 'containerextractor' }

  get bodyPattern() {
    return [WORK, WORK, WORK, WORK, WORK, MOVE]
  }

  get states() {
    return {
      [global.CREEP_STATE_REFILL]: this.refill
    }
  }

  get keepSource() {
    return true
  }

  get keepTarget() {
    return true
  }

  number(room) {
    const mineral = room.mineral

    if (!mineral) { return 0 }
    if (!mineral.container) { return 0 }
    if (!mineral.extractor) { return 0 }
    if (mineral.ticksToRegeneration) { return 0 }
    if (_.some(this.creeps, 'source', mineral)) { return 0 }

    return 1
  }

  findSource(creep) {
    const mineral = creep.room.mineral

    if (!mineral) { return }
    if (!mineral.container) { return }
    if (!mineral.extractor) { return }
    if (mineral.ticksToRegeneration) { return }
    if (_.some(this.creeps, 'source', mineral)) { return }

    return mineral
  }

  sourceNotFound(creep) {
    return
  }

  sourceAction(creep, source) {
    const container = source.container

    if (container && !source.extractor.cooldown) {
      if (creep.pos.isEqualTo(container)) {
        creep.harvest(source)
      } else {
        creep.moveTo(container)
      }
    }

    return;
  }
}
