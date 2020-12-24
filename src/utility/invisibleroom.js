'use strict'

class InvisibleRoom {
  constructor(name) {
    this.name = name
  }

  get invisible() {
    return true
  }

  get my() {
    return false
  }

  get memory() {
    return Memory.rooms[this.name] = Memory.rooms[this.name] || {}
  }

  get underAttack() {
    const ttl = CREEP_LIFE_TIME

    if (Game.time - this.memory.underAttack > ttl) {
      delete this.memory.underAttack
    }

    return this.memory.underAttack ? true : false
  }

  set underAttack(value) { return }

  get needsBuilder() {
    const ttl = CREEP_LIFE_TIME

    if (Game.time - this.memory.needsBuilder > ttl) {
      delete this.memory.needsBuilder
    }

    return this.memory.needsBuilder ? true : false
  }

  set needsBuilder(value) {}

  get needsRepairer() {
    const ttl = CREEP_LIFE_TIME

    if (Game.time - this.memory.needsRepairer > ttl) {
      delete this.memory.needsRepairer
    }

    return this.memory.needsRepairer ? true : false
  }

  set needsRepairer(value) {}

  get needsScoreHarvester() {
    const ttl = CREEP_LIFE_TIME

    if (Game.time - this.memory.needsScoreHarvester > ttl) {
      delete this.memory.needsScoreHarvester
    }

    return this.memory.needsScoreHarvester ? true : false
  }

  set needsScoreHarvester(value) {}

  get needsSigner() {
    const ttl = CREEP_LIFE_TIME

    if (Game.time - this.memory.needsSigner > ttl) {
      delete this.memory.needsSigner
    }

    return this.memory.needsSigner ? true : false
  }

  set needsSigner(value) {}

  get needsClaimer() {
    const flag = Game.flags.claim

    return (flag && this.name === flag.pos.roomName) ? true : false
  }

  get isHighway() {
    const parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(this.name)
    const isHighway = (parsed[1] % 10 === 0) || (parsed[2] % 10 === 0)

    return isHighway
  }

  get flags() {
    return _.filter(Game.flags, flag => this.name === flag.pos.roomName)
  }

  get neighbors() {
    return _.values(Game.map.describeExits(this.name))
  }

  get hostiles() {
    return []
  }

  get constructionSites() {
    return []
  }

  get damagedStructures() {
    return []
  }

  get scoreContainers() {
    return []
  }

  toString() {
    return '[iroom ' + this.name + ']'
  }
}

global.InvisibleRoom = InvisibleRoom
