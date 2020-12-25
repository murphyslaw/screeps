'use strict'

class RoomManager {
  constructor() {
    this.logger = new global.Logger('RoomManager')
  }

  visuals(room) {
    if ('W20N30' === room.name && room.scoreCollector) {
      room.scoreCollector.visualize()
    }

    // World.creeps('repairer').forEach(function (creep) {
    //   const visual = new RoomVisual(creep.room.name)
    //   visual.circle(creep.pos,
    //     { fill: 'transparent', radius: 1, stroke: 'blue', strokeWidth: .1, opacity: 1 })
    // })

    if (global.config.visuals) {
      const damagedStructures = room.damagedStructures;

      this.logger.debug('damaged structures', damagedStructures.length);

      _.forEach(damagedStructures, function(structure) {
        room.visual.circle(structure.pos,
          { fill: 'red', radius: 0.55, stroke: 'red' });
      });
    }

    return;
  }

  defense(room) {
    const towers = room.find(FIND_MY_STRUCTURES, {
      filter: { structureType: STRUCTURE_TOWER }
    })

    _.forEach(towers, function(tower) {
      const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
        filter: function(creep) {
          return creep.getActiveBodyparts(ATTACK) > 0 ||
            creep.getActiveBodyparts(RANGED_ATTACK) > 0 ||
            creep.getActiveBodyparts(WORK) > 0 ||
            creep.owner.username === 'Invader'
        }
      })

      if (closestHostile) {
        tower.attack(closestHostile)
        return
      }

      const closestWoundedFriend = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
        filter: function (creep) {
          return (creep.hits / creep.hitsMax * 100) < 75
        }
      })

      if (closestWoundedFriend) {
        tower.heal(closestWoundedFriend)
        return
      }

      const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: function (structure) {
          return (structure.hits / structure.hitsMax * 100) < 0.1
        }
      })

      if (closestDamagedStructure) {
        tower.repair(closestDamagedStructure)
        return;
      }
    })

    return
  }
}

global.roomManager = new RoomManager()
