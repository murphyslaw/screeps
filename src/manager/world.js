'use strict'

class World {
  get visibleRooms() {
    return _.values(Game.rooms)
  }

  get myRooms() {
    return _.filter(this.visibleRooms, 'my')
  }

  get knownRooms() {
    return _.map(Memory.rooms, (room, name) => this.getRoom(name))
  }

  get neighbors() {
    return _.flatten(_.map(this.myRooms, (room) => _.map(room.neighbors, (neighbor) => this.getRoom(neighbor))))
  }

  get remoteRooms() {
    return _.filter(this.neighbors, function(room) {
      return !this.includes(room) && !room.isHighway
    }, this.myRooms)
  }

  get territory() {
    return _.uniq(_.union(this.myRooms, this.neighbors))
  }

  get spawnRooms() {
    return _.map(Game.spawns, spawn => this.getRoom(spawn.room.name))
  }

  creeps(role) {
    let conditions = []

    if (role) {
      conditions.push(creep => creep.role === role)
    }

    return _.filter(Game.creeps, creep => _.every(conditions, cond => cond.call(this, creep)))
  }

  allowedRooms(from, to) {
    const allowedRooms = { [from]: true }

    const route = Game.map.findRoute(from, to, {
      routeCallback(roomName) {
        const room = global.World.getRoom(roomName)

        if (room.isHighway || room.my) {
          return 1
        } else {
          return 2.5
        }
      }
    })

    route.forEach(info => allowedRooms[info.room] = true)

    return allowedRooms
  }

  getRoom(name) {
    if (!name) return

    return Game.rooms[name] || new InvisibleRoom(name)
  }

  getRoomData(name) { return Memory.rooms[name] }

  update() {
    _.forEach(Game.creeps, function (creep, name) {
      Game.map.visual.rect(creep.pos, 1, 1, { fill: '#00ff00', opacity: 1 })
    })

    const style = {
      color: '#ffffff',
      fontSize: 5,
      backgroundColor: '#000000',
      stroke: '#000000',
      strokeWidth: 3,
      opacity: 1,
    }

    this.knownRooms.forEach(function(room) {
      if (room instanceof Room) {
        Game.map.visual.text('👀', new RoomPosition(45, 45, room.name), style)
      } else {
        Game.map.visual.text('👻', new RoomPosition(45, 45, room.name), style)
      }

      room.underAttack = room.hostiles.length > 0
      if (room.underAttack) {
        Game.map.visual.text('🔥', new RoomPosition(45, 5, room.name), style)
      }
    })

    this.myRooms.forEach(function (room) {
      room.needsSigner = !room.controller.sign || room.controller.sign.text !== Signing.text
      if (room.needsSigner) {
        Game.map.visual.text('📜', new RoomPosition(5, 45, room.name), style)
      }
    })

    this.territory.forEach(function(room) {
      room.needsBuilder = room.constructionSites.length > 0
      if (room.needsBuilder) {
        Game.map.visual.text('🚧', new RoomPosition(25, 5, room.name), style)
      }

      room.needsRepairer = room.damagedStructures.length > 0
      if (room.needsRepairer) {
        Game.map.visual.text('🛠', new RoomPosition(15, 5, room.name), style)
      }

      room.needsScoreHarvester = room.scoreContainers.length > 0
      if (room.needsScoreHarvester) {
        Game.map.visual.text('🏆', new RoomPosition(5, 5, room.name), style)
      }
    })

    return
  }

  clean() {
    for (const name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name]
      }
    }
  }
}

global.World = new World()
