'use strict';

const roleHarvester = {
  configuration: function(room) {
    return {
      role: 'harvester',
      number: room.harvestSlots(),
      bodyparts: [WORK, CARRY, MOVE],
      memory: {
        role: 'harvester'
      }
    }
  },

  run: function(creep) {
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.working = false;
    }

    if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
      creep.memory.working = true;
    }

    if (creep.memory.working) {
      const energyPriority = {
        [STRUCTURE_SPAWN]: 4,
        [STRUCTURE_EXTENSION]: 3,
        [STRUCTURE_TOWER]: 2,
        [STRUCTURE_CONTAINER]: 1
      }

      let targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return _.includes(Object.keys(energyPriority), structure.structureType) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
      });

      targets = targets.sort((a, b) => energyPriority[b.structureType] - energyPriority[a.structureType]);

      if (targets.length > 0) {
        if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0]);
        }
      }
    } else {
      const source = Game.getObjectById(creep.memory.source);

      if (source) {
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
          creep.moveTo(source);
        }
      } else {
        const sources = creep.room.find(FIND_SOURCES);

        for (const source of sources) {
          const harvesters = _.filter(Game.creeps, (creep) =>
            creep.memory.role == 'harvester' &&
            creep.memory.source == source.id
          );
          const count = source.harvestSlots();

          if (harvesters.length < count) {
            creep.memory.source = source.id;
            break;
          }
        }
      }
    }
  }
};

module.exports = roleHarvester;
