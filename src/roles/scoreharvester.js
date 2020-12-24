'use strict'

global.ScoreHarvester = class extends EnergyRole {
  get name() { return 'scoreharvester' }

  get bodyPattern() { return [CARRY, MOVE] }

  get maxCreepSize() { return this.bodyPattern.length * 6 }

  resource(creep) { return RESOURCE_SCORE }

  number(room) {
    const roomsNeedScoreHarvester = _.filter(World.territory, 'needsScoreHarvester')

    return roomsNeedScoreHarvester.length
  }

  findTarget(creep) { return creep.room.storage }

  invalidTarget(creep, target) {
    return target.store.getFreeCapacity(this.resource(creep)) == 0
  }

  findSourceRoom(room) {
    const needsScoreHarvester = _.find(World.territory, 'needsScoreHarvester')

    return needsScoreHarvester ? needsScoreHarvester.name : null
  }

  findSource(creep) {
    let source

    // score containers
    if (!source) {
      const scoreContainers = creep.room.scoreContainers

      if (scoreContainers.length) {
        source = scoreContainers[0]
      }
    }

    return source
  }

  targetAction(creep, target) {
    if (creep.transfer(target, this.resource(creep)) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target)
    }

    return
  }
}
