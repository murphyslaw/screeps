'use strict';

class RoomManager {
  constructor() {
    this.logger = new global.Logger('RoomManager');
  }

  updateState(room) {
    room.underAttack = room.hostiles.length > 0

    if (room.underAttack) {
      room.needsBuilder = null
      room.needsRepairer = null
      room.needsScoreHarvester = null
      room.needsSigner = null
    } else {
      room.needsBuilder = room.constructionSites.length > 0
      room.needsRepairer = room.damagedStructures.length > 0
      room.needsScoreHarvester = room.scoreContainers.length > 0
      room.needsSigner = room.controller && !room.controller.sign
    }

    return
  }

  visuals(room) {
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
    });

    _.forEach(towers, function(tower) {
      const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
        filter: function(creep) {
          return creep.getActiveBodyparts(ATTACK) > 0 ||
            creep.getActiveBodyparts(RANGED_ATTACK) > 0;
        }
      });

      if (closestHostile) {
        tower.attack(closestHostile);
        return;
      }

      const closestWoundedFriend = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
        filter: function (creep) {
          return (creep.hits / creep.hitsMax * 100) < 75;
        }
      });

      if (closestWoundedFriend) {
        tower.heal(closestWoundedFriend);
        return;
      }

      const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: function (structure) {
          return (structure.hits / structure.hitsMax * 100) < 0.1;
        }
      });

      if (closestDamagedStructure) {
        tower.repair(closestDamagedStructure)
        return;
      }
    });

    return;
  }
}

global.roomManager = new RoomManager();
