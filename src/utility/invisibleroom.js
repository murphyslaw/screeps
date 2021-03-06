'use strict'

class InvisibleRoom {
  constructor(name) {
    this.name = name
  }

  get visible() {
    return false
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

  get claimFlag() {
    const flag = Game.flags.claim

    return (flag && this.name === flag.pos.roomName) ? flag : null
  }

  get needsClaimer() {
    return this.claimFlag ? true : false
  }

  get needsReserver() {
    const flag = Game.flags.reserve

    return (flag && this.name === flag.pos.roomName) ? true : false
  }

  get isHighway() {
    const parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(this.name)
    const isHighway = (parsed[1] % 10 === 0) || (parsed[2] % 10 === 0)

    return isHighway
  }

  get isHighwayCrossing() {
    const parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(this.name)
    const isHighwayCrossing = (parsed[1] % 10 === 0) && (parsed[2] % 10 === 0)

    return isHighwayCrossing
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

  get defenses() {
    return []
  }

  get scoreContainers() {
    return []
  }

  get mineral() {
    const mineral = this.memory.mineral

    if (!mineral) return null

    return new InvisibleMineral(this, mineral.id)
  }

  find() {
    return []
  }

  get mineralContainer() {
    const mineral = this.mineral

    if (!mineral) return null

    return mineral.container
  }

  get sources() {
    return _.map(this.memory.sources, (source, id) => new InvisibleSource(this, id))
  }

  get sourceContainers() {
    if (!this._sourceContainers) {
      const sourceContainers = _.reduce(this.sources, function (containers, source) {
        const container = source.container

        if (container) {
          containers.push(container)
        }

        return containers
      }, [])

      this._sourceContainers = sourceContainers
    }

    return this._sourceContainers
  }

  get sourceContainerCount() {
    return this.sourceContainers.length
  }

  get sourceCount() {
    return _.keys(this.memory.sources).length
  }

  get center() {
    return new RoomPosition(25, 25, this.name)
  }

  toString() {
    return '[iroom ' + this.name + ']'
  }
}

global.InvisibleRoom = InvisibleRoom
