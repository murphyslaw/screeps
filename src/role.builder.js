var roleBuilder = {
  configuration: function (room) {
    return {
      role: 'builder',
      number: this.number(room),
      bodyparts: [WORK, CARRY, MOVE],
      memory: { role: 'builder', working: true }
    }
  },

  run: function (creep) {
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.working = false;
    }

    if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
      creep.memory.working = true;
    }

    if (creep.memory.working) {
      const construction_site = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

      if (construction_site) {
        if (creep.build(construction_site) == ERR_NOT_IN_RANGE) {
          creep.moveTo(construction_site);
        }
      }
    } else {
      let source = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
          return structure.structureType == STRUCTURE_CONTAINER &&
            structure.store[RESOURCE_ENERGY] > 0;
        }
      });

      if (!source) {
        source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
      }

      if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
      }

      if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
      }
    }
  },

  number: function(room) {
    return room.constructionSites().length > 0 ? 1 : 0;
  }
};

module.exports = roleBuilder;
