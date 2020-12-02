const roleHarvester = {
  configuration: function (room) {
    return {
      role: 'harvester',
      number: room.harvestSlots() - 2,
      bodyparts: [WORK, CARRY, MOVE],
      memory: { role: 'harvester' }
    }
  },

  run: function (creep) {
    if (!creep.memory.source) {
      const sources = creep.room.find(FIND_SOURCES);

      for (const source of sources) {
        const harvesters = _.filter(Game.creeps, (creep) =>
          creep.memory.role == 'harvester' &&
          creep.memory.source == source.id
        );
        const count = source.harvestSlots();

        if (harvesters.length < count) {
          creep.memory.source = source.id;
        }
      }

      const source = Game.getObjectById(creep.memory.source);

      if (source) {
        creep.memory.source = source.id;
      }
    }

    if (creep.store.getFreeCapacity() > 0) {
      const source = Game.getObjectById(creep.memory.source);

      if (source) {
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
          creep.moveTo(source);
        }
      }
    } else {
      const targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_SPAWN ||
            structure.structureType == STRUCTURE_TOWER ||
            structure.structureType == STRUCTURE_CONTAINER) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
      });

      if (targets.length > 0) {
        if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0]);
        }
      }
    }
  }
};

module.exports = roleHarvester;
