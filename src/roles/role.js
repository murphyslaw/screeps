'use strict'

class Role {
  constructor(actor) {
    this.actor = actor
    this.logger = new Logger('Role')
  }

  get randomName() { return Date.now().toString(36) + Math.random().toString(36).substring(2) }

  get name() { return this.constructor.name }
  get startState() { return 'Spawning' }
  get resource() { return RESOURCE_ENERGY }
  get bodyPattern() { return [] }
  get maxSpawnTime() { return this.maxCreepSize * CREEP_SPAWN_TIME }
  get maxCreepSize() { return this.bodyPattern.length }

  number(room) { return 0 }
  memory(room) { return {} }

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

  nextState(context) { throw Error('not implemented') }

  update() {
    const actor = this.actor
    let state = actor.state

    if (!state) {
      state = actor.state = this.startState
    }

    const stateClass = global[state]

    if (stateClass) {
      const stateInstance = new stateClass(state, this)
      let nextState = stateInstance.run()

      if (actor.state !== nextState) {
        stateInstance.exit()
        nextState = new global[nextState](nextState, this).enter()
      }

      actor.state = nextState
    } else {
      this.logger.debug('ROLE', 'unhandled state', state, actor.role, actor, actor.pos)
    }
  }

  wantsToSpawn(room) {
    const creeps = World.creeps(this.name)

    const count = creeps.length
    const number = this.number(room)

    if (count > number) { return false }

    const renew = _.some(creeps, function (creep) {
      return creep.ticksToLive <= this.maxSpawnTime
    }, this)

    return (count < number) || (count == number && renew)
  }

  spawn(room) {
    const spawns = room.nonSpawningSpawns
    let actionResult

    spawns.some(function (spawn) {
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

global.Role = Role
