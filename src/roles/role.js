'use strict'

global.CREEP_STATE_INITIALIZE = 0
global.CREEP_STATE_REFILL = 2
global.CREEP_STATE_WORK = 3
global.CREEP_STATE_RECYCLE = 9

global.Role = class {
  constructor() {
    this.logger = new Logger('Role')
  }

  get name() { throw Error('not implemented') }
  get randomName() { return Date.now().toString(36) + Math.random().toString(36).substring(2) }

  get startState() { return CREEP_STATE_INITIALIZE }
  get states() { return {} }

  get bodyPattern() { return [] }
  get creeps() { return _.filter(Game.creeps, 'role', this.name) }
  get maxSpawnTime() { return this.maxCreepSize * CREEP_SPAWN_TIME }
  get maxCreepSize() { return this.bodyPattern.length }

  number(room) {
    return 0
  }

  cost(body) {
    const cost = _.sum(body, part => BODYPART_COST[part])

    return cost
  }

  bodyparts(energyAvailable) {
    const pattern = this.bodyPattern
    const patternSize = pattern.length
    const maxFactor = Math.floor(this.maxCreepSize / patternSize)

    const patternCost = this.cost(pattern)
    const patternFactor = Math.floor(energyAvailable / patternCost)

    const factor = Math.min(patternFactor, maxFactor)
    const body = _.flatten(Array(factor).fill(pattern))

    return body
  }

  memory(room) {
    return {}
  }

  changeState(creep, state, rerun = true) {
    creep.state = state;

    if (rerun) {
      this.run(creep);
    }

    return;
  }

  run(creep) {
    let state = creep.state

    if (!state) {
      state = creep.state = this.startState
    }

    const action = this.states[state]

    if (action) {
      action.call(this, creep)
    } else {
      switch (state) {
        case global.CREEP_STATE_INITIALIZE:
          this.initialize(creep)

          break
        case global.CREEP_STATE_RECYCLE:
          this.recycle(creep)

          break
      }
    }

    return
  }

  initialize(creep) {
    return;
  }

  recycle(creep) {
    creep.recycle();

    return;
  }

  wantsToSpawn(room) {
    const creeps = this.creeps;

    const count = creeps.length;
    const number = this.number(room);

    if (count > number) { return false; }

    const renew = _.some(creeps, function (creep) {
      return creep.ticksToLive <= this.maxSpawnTime;
    }, this)

    return (count < number) || (count == number && renew);
  }

  spawn(room) {
    const spawns = room.nonSpawningSpawns
    let actionResult

    spawns.some(function(spawn) {
      const name = this.randomName
      const bodyparts = this.bodyparts(room.energyAvailable)
      const memory = this.memory(room)
      memory['role'] = this.name

      actionResult = spawn.spawnCreep(bodyparts, name, { memory: memory })

      if (OK === actionResult) {
        this.logger.debug('spawning ' + this.name + ': ' + name, ' at ', spawn.pos)
        return true
      }
    }, this)

    return actionResult
  }
}

module.exports = Role;
