var roleBuilder = {
  configuration: function (room) {
    return {
      role: 'repairer',
      number: this.number(room),
      bodyparts: [WORK, CARRY, MOVE],
      memory: { role: 'repairer', working: true }
    }
  },

  run: function (creep) {
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.working = false;
      creep.memory.target = null;
    }

    if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
      creep.memory.working = true;
    }

    if (creep.memory.working) {
      let target = Game.getObjectById(creep.memory.target)

      if (!target || target.hits == target.hitsMax) {
        target = creep.room.damagedStructures()[0];
      }

      if (target) {
        creep.memory.target = target.id;

        if (creep.repair(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        }
      }
    } else {
      const source = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
          return structure.structureType == STRUCTURE_CONTAINER &&
            structure.store[RESOURCE_ENERGY] > 0;
        }
      });

      if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
      }
    }
  },

  number: function (room) {
    return room.damagedStructures().length > 0 ? 3 : 0;
  }
};

module.exports = roleBuilder;
