'use strict';

class RoomManager {
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
  }

  intelligence(room) {
    let updateFrequency;

    updateFrequency = global.ENERGY_REGEN_TIME;
    if (Game.time % updateFrequency == 0) {
      if (room.storage) {
        const before = room.memory.last_storage_capacity || 0;

        let now = room.energyAvailable;
        now += room.storage.store.getUsedCapacity(RESOURCE_ENERGY);
        now += _.sum(room.containers, container => container.store.getUsedCapacity(RESOURCE_ENERGY));
        now += _.sum(Game.creeps, creep => creep.store.getUsedCapacity(RESOURCE_ENERGY));

        const change = before ? (now - before) / before * 100 : 0;
        const perTick = Math.floor((now - before) / updateFrequency);

        room.memory.last_storage_capacity = now;

        console.log('INTELLIGENCE: ', room.name, 'storage change', now, perTick, (Math.round(change * 100) / 100).toString() + '%');
      }
    }

    updateFrequency = 100;
    if (Game.time % updateFrequency == 0) {
      if (room.controller) {
        const before = room.memory.last_controller_progress || 0;
        const now = room.controller.progress;
        const change = before ? (now - before) / before * 100 : 0;
        const perTick = Math.floor((now - before) / updateFrequency);

        room.memory.last_controller_progress = now;

        console.log('INTELLIGENCE: ', room.name, 'controller progress', perTick, (Math.round(change * 100) / 100).toString() + '%');
      }
    }

    updateFrequency = 100;
    if (Game.time % updateFrequency == 0) {
      const adjacentRooms = Game.map.describeExits(room.name);

      _.forEach(adjacentRooms, function(roomName, direction) {
        Memory.rooms[roomName] = Memory.rooms[roomName] || {};

        const data = Memory.rooms[roomName];
        const roomStatus = Game.map.getRoomStatus(roomName);

        data.direction = direction;
        data.status = roomStatus.status;
      });
    }
  }
}

module.exports = new RoomManager();
