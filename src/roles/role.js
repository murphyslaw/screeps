'use strict'

class Role {
  constructor(actor) {
    this.actor = actor
    this.stateMachine = new StateMachine(this)
    this.logger = new Logger('Role')
  }

  get name() { return this.constructor.name }
  get resource() { return RESOURCE_ENERGY }
  get memory() { return this.actor.memory }

  update() {
    this.stateMachine.update()
  }

  get bodyPattern() { return [] }
  get maxCreepSize() { return this.bodyPattern.length }
  get maxSpawnTime() { return this.maxCreepSize * CREEP_SPAWN_TIME }

  bodyparts(energyAvailable) {
    const pattern = this.bodyPattern
    const patternSize = pattern.length
    const maxFactor = Math.floor(this.maxCreepSize / patternSize)

    const patternCost = _.sum(pattern, part => BODYPART_COST[part])
    const patternFactor = Math.floor(energyAvailable / patternCost)

    const factor = Math.min(patternFactor, maxFactor)
    const body = _.flatten(Array(factor).fill(pattern))

    return body
  }

  wantsToSpawn() {
    const creeps = World.creeps(this.name)

    const count = creeps.length
    const number = this.number

    if (count > number) return false

    const maxSpawnTime = this.maxSpawnTime

    const renew = _.some(creeps, function (creep) {
      return creep.ticksToLive <= maxSpawnTime
    }, this)

    return (count < number) || (count == number && renew)
  }

  spawn() {
    const room = _.find(World.spawnRooms, room => room.nonSpawningSpawns.length)

    if (!room) return false

    const actionResult = room.spawn(this)

    return actionResult
  }
}

global.Role = Role
