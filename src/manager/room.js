'use strict'

class RoomManager {
  constructor() {
    this.logger = new global.Logger('RoomManager')
  }

  defense(room) {
    const towers = room.towers

    _.forEach(towers, function(tower) {
      const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
        filter: function(creep) {
          // return tower.pos.getRangeTo(creep) < 10
          return creep.getActiveBodyparts(ATTACK) > 0 ||
            creep.getActiveBodyparts(RANGED_ATTACK) > 0 ||
            creep.getActiveBodyparts(WORK) > 0 ||
            creep.invader
        }
      })

      if (closestHostile) {
        new Attack(tower, closestHostile).execute()
        return
      }

      const closestWoundedFriend = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
        filter: creep => creep.wounded
      })

      if (closestWoundedFriend) {
        new Heal(tower, closestWoundedFriend).execute()
        return
      }

      const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: function (structure) {
          return (structure.hits / structure.hitsMax * 100) < .01 &&
            STRUCTURE_RAMPART === structure.structureType
        }
      })

      if (closestDamagedStructure) {
        new Repair(tower, closestDamagedStructure).execute()
        return
      }
    })

    return
  }
}

global.roomManager = new RoomManager()
